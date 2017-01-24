module.exports = reduceUpdates

function reduceUpdates (updates) {
  return function reducedUpdate (model, action) {
    var nextState = updates.reduce(
      (state, update) => {
        const nextState = update(state.model, action)
        const nextModel = nextState.model
        const nextEffect = nextState.effect != null
          ? state.effect.concat(nextState.effect)
          : state.effect

        return {
          model: nextModel,
          effect: nextEffect
        }
      },
      { model, effect: [] }
    )

    nextState.effect = nextState.effect.length !== 0
      ? nextState.effect : null

    return nextState
  }
}
