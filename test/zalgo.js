const test = require('tape')
const defer = require('pull-defer')
const inu = require('../')
const pull = inu.pull

test('infinite loop if sync dispatch, model always new, and effect needs to run async', function (t) {
  var i = 0
  var ended = false
  const app = {
    init: function () {
      return { model: {}, effect: 'INIT' }
    },
    update: function (model, action) {
      switch (action) {
        case 'TICK':
          return { model: {}, effect: 'NEXT' }
        case 'DONE':
          return { model: false }
      }
      return { model: model }
    },
    view: function (model, dispatch) {
      if (ended) return
      if (i++ > 1000) {
        ended = true
        t.ok(true)
        return t.end()
      }
      if (model) return dispatch('TICK')
      t.ok(false)
    },
    run: function (effect) {
      switch (effect) {
        case 'NEXT':
          const deferred = defer.source()
          process.nextTick(function () {
            deferred.resolve(pull.values(['DONE']))
          })
          return deferred
      }
    }
  }
  inu.start(app)
})

test('no infinite loop if async dispatch, model always new, and effect needs to run async', function (t) {
  var i = 0
  var ended = false
  const app = {
    init: function () {
      return { model: {}, effect: 'INIT' }
    },
    update: function (model, action) {
      switch (action) {
        case 'TICK':
          return { model: {}, effect: 'NEXT' }
        case 'DONE':
          return { model: false }
      }
      return { model: model }
    },
    view: function (model, dispatch) {
      if (ended) return
      if (i++ > 1000) {
        ended = true
        t.ok(false)
        return t.end()
      }
      if (model) {
        process.nextTick(() => {
          return dispatch('TICK')
        })
        return
      }
      t.ok(true)
      t.end()
    },
    run: function (effect) {
      switch (effect) {
        case 'NEXT':
          const deferred = defer.source()
          process.nextTick(function () {
            deferred.resolve(pull.values(['DONE']))
          })
          return deferred
      }
    }
  }
  inu.start(app)
})
