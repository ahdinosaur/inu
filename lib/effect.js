const Create = require('./create')
const Run = require('./run')
const Type = require('./type')

module.exports = Effect

function Effect (options) {
  const {
    path,
    type = Type(path[path.length - 1]),
    create,
    run
  } = options

  return {
    path,
    type,
    create: Create({
      type,
      create
    }),
    run: Run({
      type,
      run
    })
  }
}
