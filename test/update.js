var test = require('tape')

var inu = require('../')
var pull = inu.pull

test('models returned by update are emitted by the model stream', function (t) {
  var initialModel = {initial: true}
  var expectedModel = {type: 'EXPECTED_MODEL'}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      return {model: expectedModel}
    },
    view: function (model, dispatch) {
      dispatch()
      return inu.html`<div></div>`
    }
  }
  var streams = inu.start(app)

  pull(streams.models(), pull.take(2), pull.collect(function (err, models) {
    t.false(err)
    t.deepEqual(models[0], initialModel)
    t.deepEqual(models[1], expectedModel)
    t.end()
  }))
})
