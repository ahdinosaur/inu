const { start, html, pull } = require('../')

const compose = require('./compose')

const main = document.querySelector('.main')

const apps = [
  require('./title'),
  require('./counter'),
  require('./clock')
]

const app = compose(apps)

const streams = start(app)

pull(
  streams.views(),
  pull.drain(function (view) {
    html.update(main, view)
  })
)
