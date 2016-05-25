const { start, html, pull } = require('../')

const compose = require('./compose')

const main = document.querySelector('main')

const apps = [
  require('./nested'),
  require('./clock')
]

const app = compose(apps, (a, b) => html`
  <main>
    ${a}
    ${b}
  </main>
`)

const streams = start(app)

pull(
  streams.views(),
  pull.drain(function (view) {
    html.update(main, view)
  })
)
