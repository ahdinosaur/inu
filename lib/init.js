const set = require('./set')

module.exports = Init

function Init ({ init, scope = [] }) {
  return (model = {}) => {
    const state = init()
    const nextModel = set(model, scope, state.model)

    return {
      model: nextModel,
      effect: state.effect
    }
  }
}
