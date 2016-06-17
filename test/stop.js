var test = require('tape')

var inu = require('../')
var pull = inu.pull

test('calling stop() ends actions stream', function (t) {
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
      return inu.html`<div></div>`
    }
  }
  var sources = inu.start(app)
  pull(sources.actions(), pull.collect(function (err, actions) {
    t.error(err)
    t.equal(actions.length, 0, 'Actions stream ends with no emitted actions')
    t.end()
  }))
  sources.stop()
})

test('calling stop() ends effects stream', function (t) {
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
      return inu.html`<div></div>`
    }
  }
  var sources = inu.start(app)
  pull(sources.effects(), pull.collect(function (err, effects) {
    t.error(err)
    t.equal(effects.length, 0, 'Effects stream ends with no emitted actions')
    t.end()
  }))
  sources.stop()
})

test('calling stop() ends views stream', function (t) {
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
      return inu.html`<div></div>`
    }
  }
  var sources = inu.start(app)
  pull(sources.views(), pull.collect(function (err, views) {
    t.error(err)
    t.equal(views.length, 0, 'Views stream ends with no emitted actions')
    t.end()
  }))
  sources.stop()
})

test('calling stop() ends models stream', function (t) {
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
      return inu.html`<div></div>`
    }
  }
  var sources = inu.start(app)
  pull(sources.models(), pull.collect(function (err, models) {
    t.error(err)
    t.equal(models.length, 0, 'Models stream ends with no emitted actions')
    t.end()
  }))
  sources.stop()
})
test('calling stop() ends effectAction stream', function (t) {
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
      return inu.html`<div></div>`
    }
  }
  var sources = inu.start(app)
  pull(sources.effectActionsSources(), pull.collect(function (err, effectActions) {
    t.error(err)
    t.equal(effectActions.length, 0, 'EffectActions stream ends with no emitted actions')
    t.end()
  }))
  sources.stop()
})
