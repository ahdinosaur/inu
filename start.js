var Stream = require('push-stream/stream')
var StateStream = require('push-stream/state')
var MapStream = require('push-stream/map')
var FilterStream = require('push-stream/filter')
var UniqStream = require('push-stream/uniq')
var ReadableStream = require('push-stream/readable')
var push = require('push-stream/push')
var pull = require('pull-stream/pull')
var drain = require('pull-stream/sinks').drain

module.exports = start

function start (app) {
  var eventStream = Stream()
  var streams = getStreams(app, eventStream)

  streams.nextEventStream(function (nextEvent) {
    setTimeout(function () {
      eventStream.push(nextEvent)
    })
  })

  return streams
}

function getStreams (app, eventStream) {
  var onStopCallbacks = []
  var readableEventStream = ReadableStream(eventStream)

  function dispatch (nextEvent) {
    eventStream.push(nextEvent)
  }

  var initialState = app.init()
  var stateStream = StateStream(initialState)

  readableEventStream(function (event) {
    var state = stateStream()
    var nextState = app.update(state.model, event)
    stateStream.push(nextState)
  })

  var modelStream = StateStream()
  onStopCallbacks.push(push(
    stateStream,
    MapStream(function (state) { return state.model }),
    UniqStream(),
    modelStream
  ))

  var viewStream = StateStream()
  onStopCallbacks.push(push(
    modelStream,
    MapStream(function (model) {
      return app.view(model, dispatch)
    }),
    FilterStream(isNotNil),
    viewStream
  ))

  var effectStream = StateStream()
  onStopCallbacks.push(push(
    stateStream,
    MapStream(function (state) { return state.effect }),
    FilterStream(isNotNil),
    effectStream
  ))

  var nextEventStream = Stream()
  onStopCallbacks.push(push(
    effectStream,
    MapStream(function (effect) {
      pull(
        app.run(effect, readableEventStream),
        drain(function (nextEvent) {
          if (isNotNil(nextEvent)) {
            nextEventStream.push(nextEvent)
          }
        })
      )
    })
  ))

  return {
    stop: stop,
    eventStream: readableEventStream,
    nextEventStream: ReadableStream(nextEventStream),
    modelStream: ReadableStream(modelStream),
    viewStream: ReadableStream(viewStream),
    effectStream: ReadableStream(effectStream)
  }

  function stop () {
    for (var i = 0; i < onStopCallbacks.length; i++) {
      onStopCallbacks()
    }
  }
}

function isNotNil (x) { return x != null }
