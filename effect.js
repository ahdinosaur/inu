const assign = require('object-assign')
const N = require('libnested')

const Effect = require('./lib/effect')

module.exports = EffectModule

function EffectModule (definition) {
  const {
    path,
    needs = {},
    create: createEffect
  } = definition

  var gives = {
    inu: { run: true }
  }
  N.set(gives, path, true)

  return {
    needs,
    gives,
    create
  }

  function create (api) {
    const effect = Effect(
      assign(
        { path },
        createEffect(api)
      )
    )
    var module = {}
    N.set(module, path, effect.create)
    N.set(module, ['inu', 'run'], effect.run)
    return module
  }
}
