const reduceReducers = require('reduce-reducers')

module.exports = describe

function describe (domain) {
  const name = domain.name
  const update = domain.update
  const run = domain.run

  return {
    init: domain.init,
    update: combine(name, update),
    run: all(name, run)
  }
}


function combine (ns, update) {
  // combine reducer object into ns
  return reduceReducers(Object.keys(update).map((key) => {
    const reducer = update[key]
    const type = ns ? join([ns, key]) : key

    return function (model, action) {
      if (action.type === type) {
        return reducer(model[key], action.payload)
      }
      return { model }
    }
  }))
}

function all (ns, run) {

}

function join (path) {
  return path.join(':')
}

function split (path) {
  return path.split(':')
}
