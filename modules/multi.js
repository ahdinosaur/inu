const assign = require('object-assign')
const empty = require('pull-stream/sources/empty')
const many = require('pull-many')

module.exports = {
  gives: {
    inu: {
      enhancer: true
    }
  },
  create: () => ({
    inu: {
      enhancer: multi
    }
  })
}

function multi (app) {
  if (!app.run) return app

  return assign({}, app, {
    run: function runMulti (model, effect, sources) {
      if (Array.isArray(effect)) {
        return many(effect.map(function runEffect (eff) {
          return app.run(model, eff, sources) || empty()
        }))
      }
      return app.run(model, effect, sources)
    }
  })
}
