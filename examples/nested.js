const { html } = require('../')
const assign = require('object-assign')
const keys = require('own-enumerable-keys')

const Increment = Symbol('Increment')
const Decrement = Symbol('Decrement')

module.exports = {
  init: () => ({ model: 0 }),
  update: combineUpdates({
    [Increment]: (model) => ({ model: model + 1 }),
    [Decrement]: (model) => ({ model: model - 1 })
  }),
  view: (model, dispatch) => html`
    <div>
      <button onclick=${(e) =>
        dispatch(action(Decrement))
      }> - </button>
      <div>${model}</div>
      <button onclick=${(e) =>
        dispatch(action(Increment))
      }> + </button>
    </div>
  `
}

function action (type, payload) {
  return { type, payload }
}

function combineUpdates (updates) {
  return reduceUpdates(
    keys(updates).map((actionType) => {
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

function mapSymbols (object, cb) {
  return Object.getOwnPropertySymbols(object)
    .map((key) => cb(object[key], key))
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

/*
function join (path) {
  return path.join(':')
}

function split (path) {
  return path.split(':')
}

function namespaceApp (ns, app) {
  return {
    init: () => namespaceState(ns, app.init()),
    update: (model, action) => {
      const nsAction = namespaceAction(action)
      if (nsAction) {
        return app.update(model, nsAction)
      }
      return { model }
    },
    // TODO run
    view: app.view
  }
}

const defaultApp = {
  init: () => ({ model: null }),
  update: (model) => ({ model }),
  view: () => {},
  run: () => {},
}

function mergeApps (apps) {
  return apps.reduce((sofar, next) => {
    
  }, defaultApp)
}

function namespaceAction (ns, action) {
  const path = split(action.type)
  if (path[0] === ns) {
    return assign(
      {},
      action,
      { type: join(path.slice(1))
    })
  }
  return false
}

function namespaceState (ns, state) {
  return {
    model: {
      [ns]: state.model
    },
    effect: state.effect
  }
}
*/
