var test = require('tape')

var inu = require('../')
var pull = inu.pull

test('newly created app renders initial state', function (t) {
  var app = {
    init: function () {
      return {model: 1}
    },
    update: function (model, action) {
      return {model: model}
    },
    view: function (model, dispatch) {
      return inu.html`<div></div>`
    }
  }
  var streams = inu.start(app)
  pull(
    streams.views(),
    pull.drain(function (view) {
      t.ok(view)
      t.end()
    })
  )
})
