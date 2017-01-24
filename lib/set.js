const setProp = require('@f/set-prop')

module.exports =

function set (obj, path, value) {
  return setProp(path, obj, value)
}
