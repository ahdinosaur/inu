const pull = require('pull-stream')
const html = require('yo-yo')
const delay = require('pull-delay')
const start = require('../')

const main = document.querySelector('main')

const app = {

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
        return { model }
    }
  },

  view: function (model) {
    return html`
      <div>Seconds Elapsed: ${model}</div>
    `
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

pull(
  start(example),
  pull.drain(function (view) {
    html.update(main, view)
  })
