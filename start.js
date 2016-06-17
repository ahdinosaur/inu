var defined = require('defined')
var pull = require('pull-stream')
var Pushable = require('pull-pushable')
var notify = require('pull-notify')

module.exports = start

/*
  ┌────── effectActionSources ◀───────┐
  ▼                                   |
actions ─▶ states ─▶ effects ─────────┘
  ▲          |
  |          └─────▶ models ─▶ views ─┐
  |                                   |
  └──────────  dispatch ◀─────────────┘
*/

function start (app) {
  app = defined(app, {})

  var init = defined(app.init, defaultInit)
  var update = defined(app.update, defaultUpdate)
  var view = defined(app.view, noop)
  var run = defined(app.run, noop)

  var actions = notify()

  function dispatch (nextAction) {
    actions(nextAction)
  }

  var initialState = init.call(app)
  var states = notify()
  pull(
    actions.listen(),
    scan(initialState, function (state, action) {
      return update.call(app, state.model, action)
    }),
    pull.drain(states)
  )

  var models = notify()
  pull(
    states.listen(),
    pull.map(function (state) {
      return state.model
    }),
    difference(),
    pull.drain(models)
  )

  var views = notify()
  pull(
    models.listen(),
    pull.map(function (model) {
      return view.call(app, model, dispatch)
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

  var effectActionSources = notify()

  var notifys = {
    actions: actions,
    states: states,
    models: models,
    views: views,
    effects: effects,
    effectActionSources: effectActionSources
  }

  var sources = {}
  Object.keys(notifys).forEach(function (name) {
    sources[name] = notifys[name].listen
  })

  pull(
    effects.listen(),
    pull.map(function (effect) {
      if (run.length > 2) {
        var effectActionSink = Pushable()
        run.call(app, effect, sources, effectActionSink)
        return effectActionSink
      }
      return run.call(app, effect, sources, effectActionSink)
    }),
    pull.filter(isNotNil),
    pull.drain(effectActionSources)
  )

  pull(
    effectActionSources.listen(),
    drainMany(actions)
  )

  process.nextTick(function () {
    states(initialState)
  })

  return Object.assign({}, sources, { stop: stop })

  function stop () {
    Object.keys(notifys).forEach(function (name) {
      notifys[name].end()
    })
  }
}

function noop () {}
function isNotNil (x) { return x != null }
function defaultInit () { return { model: null } }
function defaultUpdate (model) { return { model: model } }

// TODO extract out into `pull-scan`
function scan (value, accumulator) {
  return pull.map(function update (nextValue) {
    value = accumulator(value, nextValue)
    return value
  })
}

// TODO extract out into `pull-difference`
function difference () {
  var lastValue
  return pull.filter(function (value) {
    var condition = value !== lastValue
    lastValue = value
    return condition
  })
}

// TODO extract out into `pull-drain-many` ?
function drainMany (cb) {
  return function (source) {
    pull(
      source,
      pull.drain(function (stream) {
        pull(
          stream,
          pull.drain(cb)
        )
      })
    )
  }
}
