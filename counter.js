const { html } = require('../')
const assign = require('object-assign')
const keys = require('own-enumerable-keys')

const INCREMENT = Symbol('increment')
const DECREMENT = Symbol('decrement')
const SET = Symbol('set')

const increment = createAction(INCREMENT)
const decrement = createAction(DECREMENT)
const set = createAction(SET)

module.exports = {
  init: () => ({ model: 0 }),
  update: handleActions({
    [INCREMENT]: (model) => ({ model: model + 1 }),
    [DECREMENT]: (model) => ({ model: model - 1 }),
    [SET]: (model, payload) => ({ model: payload })
  }),
  view: (model, dispatch) => html`
    <div>
      <button onclick=${(e) =>
        dispatch(decrement())
      }> - </button>
      <input type='number'
        oninput=${(ev) => {
          dispatch(set(Number(ev.target.value)))
        }}
        value=${model}
      />
      <button onclick=${(e) =>
        dispatch(increment())
      }> + </button>
    </div>
  `
}

function createAction (type, payloadCreator = identity) {
  return (...args) => ({
    type,
    payload: payloadCreator(...args)
  })
}

function handleActions (actionHandlers) {
  return reduceUpdates(
    keys(actionHandlers).map((actionType) => {
      const update = actionHandlers[actionType]

      return function (model, action) {
        if (action.type === actionType) {
          return update(model, action.payload)
        }
        return { model }
      }
    })
  )
}

function reduceUpdates (updates) {
  return function (model, action) {
    return updates.reduce(
      (state, update) => assign(
        {}, state, update(state.model, action)
      ),
      { model }
    )
  }
}

function identity (id) { return id }
