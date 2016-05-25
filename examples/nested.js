const { html } = require('../')
const mapValues = require('map-values')
const extend = require('xtend')

const actions = createActionCreators({
  increment: () => null,
  decrement: () => null
})

module.exports = {
  init: () => ({ model: 0 }),
  update: combineUpdates({
    increment: (model) => ({ model: model + 1 }),
    decrement: (model) => ({ model: model - 1 })
  }),
  view: (model, dispatch) => html`
    <div>
      <button onclick=${(e) =>
        dispatch(actions.decrement())
      }> - </button>
      <div>${model}</div>
      <button onclick=${(e) =>
        dispatch(actions.increment())
      }> + </button>
    </div>
  `
}

function createActionCreators (object) {
  return mapValues(object, (payloadCreator, actionType) => {
    return (...args) => ({
      type: actionType,
      payload: payloadCreator(...args)
    })
  })
}

function combineUpdates (updates) {
  return reduceUpdates(
    Object.keys(updates).map((actionType) => {
      const update = updates[actionType]

      return function (model, action) {
        if (action.type === actionType) {
          return update(model, action)
        }
        return { model }
      }
    })
  )
}

function reduceUpdates (updates) {
  return function (model, action) {
    return updates.reduce(
      (state, update) => {
        return extend(state, update(state.model, action))
      },
      { model }
    )
  }
}
