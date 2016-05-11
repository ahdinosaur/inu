//var html = require('yo-yo')
var pull = require('pull-stream')
var delay = require('pull-delay')
var start = require('../')

var main = document.querySelector('main')

// clock demo
var app = {

  init: function () {
    return {
      model: 0,
      effect: 'SCHEDULE_TICK' // start perpetual motion
    }
  },

  update: function (model, event) {
    switch (event) {
      case 'TICK':
        return {
          model: model === 59 ? 0 : model + 1,
          effect: 'SCHEDULE_TICK'
        }
      default:
        return { model: model }
    }
  },

  view: function (model, dispatch) {
    var el = document.createElement('div')
    el.textContent = "Seconds Elapsed: " + model
    return el

    /*
    return html`
      <div>Seconds Elapsed: ${model}</div>
    `
    */
  },

  run: function (effect) {
    switch (effect) {
      case 'SCHEDULE_TICK':
        return pull(
          pull.values(['TICK']),
          delay(1000)
        )
    }
  }
}

var streams = start(app)

streams.watchView(function (view) {
  main.innerHTML = view.outerHTML
  // html.update(main, view)
})
