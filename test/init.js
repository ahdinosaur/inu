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
  var sources = inu.start(app)
  pull(sources.effects(), pull.take(1), pull.drain(function (effect) {
    t.equal(effect, expectedEffect)
    t.end()
  }))
})
