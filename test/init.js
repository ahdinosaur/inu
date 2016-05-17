var test = require('tape')

var inu = require('../')
var pull = inu.pull

test('initial state of model can be set in init', function (t) {
  var initialModel = {initial: true}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      t.equal(model, initialModel, 'model passed to update is set by initial state')
      t.end()
      return {model: model}
    },
    view: function (model, dispatch) {
      dispatch()
      return inu.html`<div></div>`
    }
  }
  inu.start(app)
})

test.skip('returning an action in init dispatches the action to update', function (t) {
  var expectedAction = {type: 'WEEEEEE'}
  var app = {
    init: function () {
      return {
        action: expectedAction,
        model: 0
      }
    },
    update: function (model, action) {
      t.equal(action, expectedAction)
      t.end()
      return {model: model}
    },
    view: function (model, dispatch) {
      dispatch()
      return inu.html`<div></div>`
    }
  }
  inu.start(app)
})

// failing test that should pass?
test.skip('returning an action in init emits the action on the actions stream', function (t) {
  var expectedAction = {type: 'WEEEEEE'}
  var app = {
    init: function () {
      return {
        action: expectedAction,
        model: 0
      }
    },
    update: function (model, action) {
      return {model: model}
    },
    view: function (model, dispatch) {
      dispatch()
      return inu.html`<div></div>`
    }
  }
  var streams = inu.start(app)
  pull(streams.actions(), pull.take(1), pull.drain(function (action) {
    t.equal(action, expectedAction)
    t.end()
  }))
})

test('returning an effect in init emits the effect on the effects stream', function (t) {
  var expectedEffect = {type: 'WEEEEEE'}
  var app = {
    init: function () {
      return {
        effect: expectedEffect,
        model: 0
      }
    },
    update: function (model, action) {
      return {model: model}
    },
    view: function (model, dispatch) {
      dispatch()
      return inu.html`<div></div>`
    },
    run: function () {}
  }
  var streams = inu.start(app)
  pull(streams.effects(), pull.take(1), pull.drain(function (effect) {
    t.equal(effect, expectedEffect)
    t.end()
  }))
})
