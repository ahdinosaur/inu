var pull = require('pull-stream')
var notify = require('pull-notify')

module.exports = start

/*
  ┌────── effectActionStreams ◀───────┐
  ▼                                   |
actions ─▶ states ─▶ effects ─────────┘
  ▲          |
  |          └─────▶ models ─▶ views ─┐
  |                                   |
  └──────────  dispatch ◀─────────────┘
*/

function start (app) {
  var actions = notify()

  function dispatch (nextAction) {
    actions(nextAction)
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

  var effectActionStreams = notify()
  pull(
    effects.listen(),
    pull.map(function (effect) {
      return app.run(effect, actions.listen)
    }),
    pull.filter(isNotNil),
    pull.drain(effectActionStreams)
  )

  pull(
    effectActionStreams.listen(),
    pull.flatten(),
    pull.drain(actions)
  )

  states(initialState)

  return {
    stop: stop,
    actions: actions.listen,
    states: states.listen,
    models: models.listen,
    views: views.listen,
    effects: effects.listen,
    effectActionStreams: effectActionStreams.listen,
  }

  function stop () {
    ;[
      actions,
      states,
      models,
      views,
      effects,
      effectActionStreams
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
