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
  var sources = inu.start(app)
  pull(
    sources.views(),
    pull.drain(function (view) {
      t.ok(view)
      t.end()
    })
  )
})

test('view stream will not emit a view if view function returns null', function (t) {
  t.plan(1)
  var initialModel = {initial: true}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      return {model: model}
    },
    view: function (model, dispatch) {
      t.ok(true)
      return null
    }
  }
  var sources = inu.start(app)

  pull(sources.views(), pull.drain(function (model) {
    t.false(model)
  }))
})

test('view stream will not emit a view if view function returns undefined', function (t) {
  t.plan(1)
  var initialModel = {initial: true}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      return {model: model}
    },
    view: function (model, dispatch) {
      t.ok(true)
    }
  }
  var sources = inu.start(app)

  pull(sources.views(), pull.drain(function (model) {
    t.false(model)
  }))
})
