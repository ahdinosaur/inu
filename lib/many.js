const empty = require('pull-stream/sources/empty')
const pullMany = require('pull-many')

module.exports = runMany

function runMany (runs) {
  return function manyEffect (model, effect, sources) {
    const nextActions = runs.map(run => {
      if (run == null) return empty()
      return run(model, effect, sources) || empty()
    })

    return pullMany(nextActions)
  }
}
