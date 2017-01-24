const N = require('libnested')

const set = require('./set')

module.exports = Update

function Update ({ update, type, scope = [] }) {
  return switchUpdate({
    type,
    update: scopeUpdate({
      update,
      scope
    })
  })
}

function switchUpdate ({ update, type }) {
  return function switchedUpdate (model, action) {
    if (action.type === type) {
      return update(model, action.payload)
    }
    return { model }
  }
}

function scopeUpdate ({ update, scope }) {
  return function scopedUpdate (model, action) {
    const scopePrevModel = N.get(model, scope)
    const scopeState = update(scopePrevModel, action)
    const nextModel = set(model, scope, scopeState.model)

    return {
      model: nextModel,
      effect: scopeState.effect
    }
  }
}
