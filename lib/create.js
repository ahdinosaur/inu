module.exports = Create

function Create (options) {
  const {
    type,
    create = payload => payload
  } = options

  return (...args) => ({
    type,
    payload: create(...args)
  })
}
