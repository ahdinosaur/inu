var Event = require('geval/event')
var Observ = require('observ')
var computed = require('observ/computed')
var watch = require('observ/watch')
var ap = require('ap')
var pull = require('pull-stream/pull')
var drain = require('pull-stream/sinks').drain

module.exports = start

function start (app) {
  var streams

  var eventVent = Event()
  var streams = getStreams(app, eventVent)

  streams.onNextEvent(function (nextEvent) {
    process.nextTick(function () {
      eventVent.broadcast(nextEvent)
    })
  })

  return streams
}

function getStreams (app, eventVent) {
  var onEvent = eventVent.listen

  function dispatch (nextEvent) {
    eventVent.broadcast(nextEvent)
  }

  var initialState = app.init()
  var stateObs = Observ(initialState)

  onEvent(function (event) {
    var state = stateObs()
    var nextState = app.update(state.model, event)
    stateObs.set(nextState)
  })

  var modelObs = computed([stateObs], function (state) {
    return state.model
  })

  var viewObs = computed([modelObs], function (model) {
    var nextView = app.view(model, dispatch)
    return nextView
  })

  var effectObs = computed([stateObs], function (state) {
    return state.effect
  })

  var nextEventVent = Event()

  watch(effectObs, function (effect) {
    if (effect == null) return

    pull(
      app.run(effect, onEvent),
      drain(function (nextEvent) {
        if (nextEvent == null) return

        nextEventVent.broadcast(nextEvent)
      })
    )
  })

  return {
    onEvent: eventVent.listen,
    onNextEvent: nextEventVent.listen,
    watchModel: ap.partial(watch, modelObs),
    watchView: ap.partial(watch, viewObs),
    watchEffect: ap.partial(watch, effectObs)
  }
}
