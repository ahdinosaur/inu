module.exports = Run

function Run ({ run, type }) {
  return switchRun({
    type,
    run
  })
}

function switchRun ({ run, type }) {
  return function switchedRun (model, effect, sources) {
    if (effect.type === type) {
      return run(model, effect.payload, sources)
    }
    return null
  }
}
