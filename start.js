var defined = require('defined')
var pull = require('pull-stream/pull')
var values = require('pull-stream/sources/values')
var map = require('pull-stream/throughs/map')
var filter = require('pull-stream/throughs/filter')
var drain = require('pull-stream/sinks/drain')
var notify = require('pull-notify')
var cat = require('pull-cat')

var defaults = require('./defaults')

module.exports = start

/*
  ┌────── effectActionsSources ◀───────┐
  ▼                                   |
actions ─▶ states ─▶ effects ─────────┘
  ▲          |
  |          └─────▶ models ─▶ views ─┐
  |                                   |
  └──────────  dispatch ◀─────────────┘
*/

function start (app) {
  app = defined(app, {})

  var init = defined(app.init, defaults.init)
  var update = defined(app.update, defaults.update)
  var view = defined(app.view, defaults.view)
  var run = defined(app.run, defaults.run)

  var actions = notify()
  var nextActions = notify()

  pull(
    nextActions.listen(),
    drain(function (value) {
      process.nextTick(function () {
        actions(value)
      })
    })
  )

  function dispatch (nextAction) {
    nextActions(nextAction)
  }

  var initialState = init.call(app)
  var states = notify()
  pull(
    actions.listen(),
    scan(initialState, function (state, action) {
      return update.call(app, state.model, action)
    }),
    drain(states)
  )

  var models = notify()
  pull(
    states.listen(),
    map(function (state) {
      return state.model
    }),
    difference(),
    drain(models)
  )

  var views = notify()
  pull(
    models.listen(),
    map(function (model) {
      return view.call(app, model, dispatch)
    }),
    filter(isNotNil),
    drain(views)
  )

  var effects = notify()
  pull(
    states.listen(),
    map(function (state) {
      return state.effect
    }),
    filter(isNotNil),
    drain(effects)
  )

  var effectActionsSources = notify()

  var notifys = {
    actions: actions,
    states: states,
    models: models,
    views: views,
    effects: effects,
    effectActionsSources: effectActionsSources,
    nextActions: nextActions
  }

  var sources = {}
  Object.keys(notifys).forEach(function (name) {
    var listen = notifys[name].listen
    sources[name] = (
      ['states', 'models', 'effects', 'views'].indexOf(name) !== -1
    ) ? replayLastValue(listen) : listen
  })

  pull(
    effects.listen(),
    map(function (effect) {
      return run.call(app, effect, sources)
    }),
    filter(isNotNil),
    drain(effectActionsSources)
  )

  pull(
    effectActionsSources.listen(),
    drainMany(nextActions)
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

function isNotNil (x) { return x != null }

// TODO extract out into `pull-scan`
function scan (value, accumulator) {
  return map(function update (nextValue) {
    value = accumulator(value, nextValue)
    return value
  })
}

// TODO extract out into `pull-difference`
function difference () {
  var lastValue
  return filter(function (value) {
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
      drain(function (stream) {
        pull(
          stream,
          drain(cb)
        )
      })
    )
  }
}

function replayLastValue (listen) {
  var lastValue
  pull(
    listen(),
    drain(function (value) {
      lastValue = value
    })
  )

  return function listenWithLastValue () {
    return cat([
      lastValue == null ? undefined : values([lastValue]),
      listen()
    ])
  }
}
