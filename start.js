var defined = require('defined')
var pull = require('pull-stream')
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

  var effectActionsSources = notify()

  var notifys = {
    actions: actions,
    states: states,
    models: models,
    views: views,
    effects: effects,
    effectActionsSources: effectActionsSources
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
    pull.map(function (effect) {
      return run.call(app, effect, sources)
    }),
    pull.filter(isNotNil),
    pull.drain(effectActionsSources)
  )

  pull(
    effectActionsSources.listen(),
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

function isNotNil (x) { return x != null }

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

function replayLastValue (listen) {
  var lastValue
  pull(
    listen(),
    pull.drain(function (value) {
      lastValue = value
    })
  )

  return function listenWithLastValue () {
    return cat([
      lastValue == null ? undefined : pull.values([lastValue]),
      listen()
    ])
  }
}
