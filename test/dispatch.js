var test = require('tape')

var inu = require('../')
var pull = inu.pull

test('Calling dispatch triggers update function with action passed to dispatch.', function (t) {
  var initialModel = {initial: true}
  var expectedAction = {type: 'DISPATCHED'}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      t.equal(action, expectedAction, 'action passed to update is the action passed to dispatch')
      t.end()
      return {model: model}
    },
    view: function (model, dispatch) {
      dispatch(expectedAction)
      return inu.html`<div></div>`
    }
  }
  inu.start(app)
})

test('Delaying call to dispatch triggers update function with action passed to dispatch.', function (t) {
  var initialModel = {initial: true}
  var expectedAction = {type: 'DISPATCHED'}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      t.equal(action, expectedAction, 'action passed to update is the action passed to dispatch')
      t.end()
      return {model: model}
    },
    view: function (model, dispatch) {
      setTimeout(function () { dispatch(expectedAction) }, 10)
      return inu.html`<div></div>`
    }
  }
  inu.start(app)
})
test('Calling dispatch emits actions on the action stream.', function (t) {
  var initialModel = {initial: true}
  var expectedAction = {type: 'DISPATCHED'}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      return {model: model}
    },
    view: function (model, dispatch) {
      setTimeout(function () { dispatch(expectedAction) }, 10)
      return inu.html`<div></div>`
    }
  }
  var sources = inu.start(app)
  pull(sources.actions(), pull.take(1), pull.drain(function (action) {
    t.equal(action, expectedAction)
    t.end()
  }))
})
