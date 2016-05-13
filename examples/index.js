const html = require('yo-yo')
const inu = require('../')

const compose = require('./compose')

const main = document.querySelector('main')

const apps = [
  require('./title'),
  require('./clock')
]

const app = compose(apps, (a, b) => html`
  <main>
    ${a}
    ${b}
  </main>
`)

const streams = inu.start(app)

streams.viewStream(function (view) {
  html.update(main, view)
})
