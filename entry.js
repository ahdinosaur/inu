const apply = require('depject/apply')

const reduce = require('./lib/reduce')
const many = require('./lib/many')

module.exports = entry

function entry (sockets) {
  const init = reduce(sockets.inu.init)
  const update = reduce(sockets.inu.update)
  const run = many(sockets.inu.run)
  const view = apply.first(sockets.inu.view)

  const store = { init, update, run, view }

  const enhancer = apply.reduce(sockets.inux.enhancer)

  return enhancer(store)
}
