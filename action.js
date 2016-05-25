var extend = require('xtend')

module.exports = createAction

// TODO extract out into module
function createAction (type, action) {
  return (typeof type === 'object')
    ? type
    : (typeof type === 'string')
      ? extend({ type }, action)
      : null
}
