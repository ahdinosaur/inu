module.exports = {
  init: init,
  update: update,
  view: view,
  run: run
}

function init () { return { model: null } }
function update (model) { return { model: model } }
function view () { return null }
function run () { return null }
