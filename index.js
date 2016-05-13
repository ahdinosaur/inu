var inu = require('./start') // back compat

inu.start = require('./start')
inu.html = require('./html')
inu.pull = require('./pull')

module.exports = inu

/*
module.exports = {
  start: require('./start')
  // push: require('push-stream'), ?
  pull: require('pull-stream'),
  html: require('yo-yo'),
  // css: require('sheetify'), ?
  // router: require('sheet-router'), ?
}
*/
