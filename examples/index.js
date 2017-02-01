const combine = require('depject')
const pull = require('pull-stream')
const delay = require('pull-delay')
const start = require('inu-engine')
const html = require('yo-yo')
const inu = require('../')

const state = inu.State({
  needs: { scheduleTick: 'first' },
  create: (api) => ({
    init: () => ({
      model: 0,
      effect: api.scheduleTick()
    })
  })
})

const tick = inu.Action({
  path: ['tick'],
  needs: { scheduleTick: 'first' },
  create: (api) => ({
    update: (model) => ({
      model: (model + 1) % 60,
      effect: api.scheduleTick()
    })
  })
})

const scheduleTick = inu.Effect({
  path: ['scheduleTick'],
  needs: { tick: 'first' },
  create: (api) => ({
    run: () => pull(
      pull.values([api.tick()]),
      delay(1000)
    )
  })
})

const view = {
  needs: { inu: { html: 'first' } },
  gives: { inu: { view: true } },
  create: (api) => {
    return { inu: { view } }

    function view (model) {
      return api.inu.html`
        <div class='clock'>
          Seconds Elapsed: ${model}
        </div>
      `
    }
  }
}

const modules = {
  state,
  tick,
  scheduleTick,
  view,
  inuModules: inu.modules
}

const sockets = combine(modules)
const store = inu.entry(sockets)
const { views } = start(store)

const main = document.querySelector('.main')
pull(views(), pull.drain(html.update.bind(null, main)))
