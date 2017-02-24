const html = require('yo-yo')
const nest = require('depnest')

module.exports = {
  gives: nest('html', [
    'create',
    'update'
  ]),
  create: () => nest('html', {
    create: html,
    update: html.update
  })
}
