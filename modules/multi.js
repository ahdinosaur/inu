const multi = require('inu-multi')

module.exports = {
  gives: {
    inux: {
      enhancer: true
    }
  },
  create: () => ({
    inux: {
      enhancer: multi
    }
  })
}
