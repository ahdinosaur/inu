const assign = require('object-assign')
const N = require('libnested')

const Action = require('./lib/action')

module.exports = ActionModule

function ActionModule (definition) {
  const {
    path,
    needs = {},
    create: createAction
  } = definition

  var gives = {
    inu: { update: true }
  }
  N.set(gives, path, true)

  return {
    needs,
    gives,
    create
  }

  function create (api) {
    const action = Action(
      assign(
        { path },
        createAction(api)
      )
    )
    var module = {}
    N.set(module, path, action.create)
    N.set(module, ['inu', 'update'], action.update)
    return module
  }
}
