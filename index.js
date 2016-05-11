const pull = require('pull-stream')
const Pushable = require('pull-pushable')
const delay = require('pull-delay')
const cat = require('pull-cat')
const fork

module.exports = start

function start (app, onClose) {
  var eventStream = Pushable(onClose)
  var streams = getStreams(app, eventStream)

  // run effects
  pull(
    streams.nextEventStream,
    delay(0), // process next events in the next tick
    pull.drain(function (event) {
      eventStream.push(event)
    })
  )

  return streams
}

function getStreams (app, eventStream) {
  var readOnlyEvents = pull(eventStream, pull.map(identity))

  function dispatch (event) {
    eventStream.push(event)
  }

  var state = app.init()
  var stateStream = cat(
    pull.values([state]),
    pull(
      eventStream,
      pull.map(function (event) {
        state = app.update(state.model, event)
        return state
      })
    )
  )

  var modelStream = Pushable()
    stateStream,
    pull.map(function (state) {
      return state.model
    }),
    pull.unique()
  )

  var viewStream = pull(
    modelStream,
    pull.map(function (model) {
      return app.view(model, dispatch)
    }),
    pull.filter(isNotNil)
  )

  var effectStream = pull(
    stateStream,
    pull.map(function (state) {
      return state.effect
    }),
    pull.filter(isNotNil)
  )

  // return ways to observe
  // - stateStream
  // - modelStream
  // - viewStream
  // - effectStream
  // - nextEventStreams
  // - nextEventStream
  // possibly using `geval`?
  //

  return {
    viewStream
  }
}

function identity (x) { return x }

function isNotNil (x) { return x != null }

function rePull (source, onClose) {
  var stream = Pushable(onClose)

  return pull(
    source,
    pull.drain(function (data) {
      stream.push(data)
    })
  )

  return stream
}
