var test = require('tape')

var inu = require('../')
var pull = inu.pull

test('returning an effect from update triggers the run function', function (t) {
  var initialModel = {initial: true}
  var expectedEffect = {type: 'EXPECTED_EFFECT'}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      return {
        model: model,
        effect: expectedEffect
      }
    },
    view: function (model, dispatch) {
      dispatch()
      return inu.html`<div></div>`
    },
    run: function (effect) {
      t.deepEqual(effect, expectedEffect, 'effect is equivalent to effect object returned in update')
      t.end()
    }
  }
  inu.start(app)
})

test('returning an effect from init triggers the run function', function (t) {
  var expectedEffect = {type: 'EXPECTED_EFFECT'}
  var app = {
    init: function () {
      return {effect: expectedEffect}
    },
    update: function (model, action) {
      return {
        model: model,
        effect: expectedEffect
      }
    },
    view: function (model, dispatch) {
      dispatch()
      return inu.html`<div></div>`
    },
    run: function (effect) {
      t.deepEqual(effect, expectedEffect, 'effect is equivalent to effect object returned in init')
      t.end()
    }
  }
  inu.start(app)
})
test('returning an action from effect triggers the update function', function (t) {
  var initialModel = {initial: true}
  var expectedEffect = {type: 'EXPECTED_EFFECT'}
  var expectedAction = {type: 'EXPECTED_ACTION'}
  var app = {
    init: function () {
      return {
        model: initialModel,
        effect: expectedEffect
      }
    },
    update: function (model, action) {
      t.deepEqual(action, expectedAction, 'Action passed to update is equivalent to the one returned in run')
      t.end()
      return {model: model}
    },
    view: function (model, dispatch) {
      return inu.html`<div></div>`
    },
    run: function (effect) {
      return pull.values([expectedAction])
    }
  }
  inu.start(app)
})
