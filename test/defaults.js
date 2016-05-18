var test = require('tape')

var inu = require('../')
var pull = inu.pull

test('defaultInit', function (t) {
  t.plan(1)
  var expectedModel = null
  inu.start({
    update: function (model) {
      t.notOk(true, 'should not update state')
    },
    view: function (model) {
      t.equal(model, expectedModel, 'init model is expected')
    },
    run: function (effect) {
      t.notOk(true, 'should not run effect')
    }
  })
})

test('defaultUpdate', function (t) {
  var expectedModel = { initial: true }
  var initialState = {
    model: expectedModel,
    effect: 'INITIALIZE'
  }
  var streams = inu.start({
    init: function () { return initialState },
    run: function (effect) {
      t.equal(effect, initialState.effect, 'effect received')
      return pull.values([
        'ACTION1', 'ACTION2', 'ACTION3'
      ])
    }
  })
  pull(
    streams.models(),
    pull.drain(function (model) {
      t.equal(model, expectedModel, 'initial model is expected')
      process.nextTick(function () {
        // no other new models received by next tick
        t.end()
      })
    })
  )
})

test('defaultView', function (t) {
  var streams = inu.start({})
  pull(
    streams.views(),
    pull.drain(function (view) {
      t.notOk(true, 'did not expect to receive default empty view')
    })
  )
  process.nextTick(function () {
    t.end()
  })
})

test('defaultRun', function (t) {
  // not sure if this any good of a test
  var expectedActions = [
    'ACTION1',
    'ACTION2',
    'ACTION3'
  ]
  var initialState = {
    model: true,
    effect: 'INITIALIZE'
  }
  var streams = inu.start({
    init: function () { return initialState },
    view: function (model, dispatch) {
      expectedActions.forEach(dispatch)
    }
  })
  pull(
    streams.actions(),
    pull.take(3),
    pull.collect(function (err, actions) {
      t.error(err)
      t.deepEqual(actions, expectedActions, 'actions are the same')
      t.end()
    })
  )
})

test('defaultApp', function (t) {
  var streams = inu.start()
  t.ok(streams, 'undefined app has streams')
  t.end()
})
