var test = require('tape')

var inu = require('../')

test('Calling dispatch triggers update function with action passed to dispatch.', function (t) {
  var initialModel = {initial: true}
  var expectedAction = {type: 'DISPATCHED'}
  var app = {
    init: function () {
      return {model: initialModel}
    },
    update: function (model, action) {
      t.deepEqual(action, expectedAction, 'action passed to update is the action passed to dispatch')
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
