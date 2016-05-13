var pull = require('pull-stream')
var notify = require('pull-notify')

module.exports = start

/*
    --------- next actions <------
    v                             |
actions -> states -> effects -> run
    ^         |
    |         -----> models -> views
    |                             |
    ----------- dispatch <--------
*/

function start (app) {
  var actions = notify()
  var nextActions = notify()

  pull(
    nextActions.listen(),
    pull.drain(function (nextAction) {
      // queue next actions on next tick
      process.nextTick(function () {
        actions(nextAction)
      })
    })
  )

  function dispatch (nextAction) {
    nextActions(nextAction)
  }

  var initialState = app.init()
  var states = notify()
  pull(
    actions.listen(),
    pull.map(reduceActions(app.update, initialState)),
    pull.drain(states)
  )

  var models = notify()
  pull(
    states.listen(),
    pull.map(function (state) {
      return state.model
    }),
    pull.unique(),
    pull.drain(models)
  )

  var views = notify()
  pull(
    models.listen(),
    pull.map(function (model) {
      return app.view(model, dispatch)
    }),
    pull.filter(isNotNil),
    pull.drain(views)
  )

  var effects = notify()
  pull(
    states.listen(),
    pull.map(function (state) {
      return state.effect
    }),
    pull.filter(isNotNil),
    pull.drain(effects)
  )

  pull(
    effects.listen(),
    pull.drain(function (effect) {
      const result = app.run(effect, actions.listen)
      pull(
        isNotNil(result) ? result : push.empty(),
        pull.filter(isNotNil),
        pull.drain(nextActions)
      )
    })
  )

  states(initialState)

  return {
    stop: stop,
    actions: actions.listen,
    states: states.listen,
    models: models.listen,
    views: views.listen,
    effects: effects.listen,
    nextActions: nextActions.listen
  }

  function stop () {
    ;[
      actions,
      states,
      models,
      views,
      effects,
      nextActions
    ].forEach(function (stream) {
      stream.end()
    })
  }
}

function isNotNil (x) { return x != null }

function reduceActions (lambda, initialState) {
  var state = initialState
  return function update (action) {
    state = lambda(state.model, action)
    return state
  }
}
