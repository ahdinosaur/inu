const html = require('yo-yo')
const pull = require('pull-stream')
const delay = require('pull-delay')

// clock demo
module.exports = {

  init: () => ({
    model: 0,
    effect: 'SCHEDULE_TICK' // start perpetual motion
  }),

  update: (model, event) => {
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

  view: (model, dispatch) => html`
    <div class='clock'>
      Seconds Elapsed: ${model}
    </div>
  `,

  run: (effect) => {
    switch (effect) {
      case 'SCHEDULE_TICK':
        return pull(
          pull.values(['TICK']),
          delay(1000)
        )
    }
  }
}
