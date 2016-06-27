var test = require('tape')

var inu = require('../')
var pull = inu.pull

test('models returned by update are emitted by the model stream', function (t) {
  var initialModel = {initial: true}
  var expectedModel = {count: 0}
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
  var sources = inu.start(app)

  pull(sources.models(), pull.take(2), pull.collect(function (err, models) {
    t.error(err)
    t.equal(models[0], initialModel)
    t.equal(models[1], expectedModel)
    t.end()
  }))
})

test('model stream will not emit a model if is a duplicate', function (t) {
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
      dispatch()
      return inu.html`<div></div>`
    }
  }
  var sources = inu.start(app)

  pull(sources.models(), pull.drain(function (model) {
    t.equal(model, initialModel)
  }))
})

test('effects stream will not emit an effect if update returns a null effect', function (t) {
  t.plan(1)
  var initialModel = {initial: true}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      t.ok(model)
      return {model, effect: null}
    },
    view: function (model, dispatch) {
      dispatch()
    },
    run: function (effect) {
      t.fail()
    }
  }
  var sources = inu.start(app)

  pull(sources.effects(), pull.drain(function (model) {
    t.fail()
  }))
})

test('effects stream will not emit an effect if update returns an undefined effect', function (t) {
  t.plan(1)
  var initialModel = {initial: true}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      t.ok(model)
      return {model, effect: undefined}
    },
    view: function (model, dispatch) {
      dispatch()
    },
    run: function (effect) {
      t.fail()
    }
  }
  var sources = inu.start(app)

  pull(sources.effects(), pull.drain(function (model) {
    t.fail()
  }))
})
