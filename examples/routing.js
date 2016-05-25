const assign = require('object-assign')
const href = require('sheet-router/href')
const history = require('sheet-router/history')
const Pushable = require('pull-pushable')
const { html } = require('../')

/*
const Router = require('sheet-router')
const router = Router('/404', function (route) {
  return [
    route('/', (params) => yo`<div>where are you?</div>`),
    route('/:place', (params) => yo`<div>welcome to ${params.place}</div>`, [
  ]
})
*/

// routing demo
module.exports = {

  init: () => ({
    model: document.location.href,
    effect: 'INIT_ROUTER'
  }),

  update: (model, action) => {
    switch (action.type) {
      case 'SET_LOCATION':
        return { model: action.payload }
      default:
        return { model }
    }
  },

  view: (model, dispatch) => html`
    <div>
      <h2>${model}</h2>
      <nav>
        <a href="./">home</a>
        <a href="./here">here</a>
        <a href="./there">there</a>
        <a href="./anywhere">anywhere</a>
      </nav>
    </div>
  `,

  run: (effect, actions) => {
    if (effect !== 'INIT_ROUTER') { return }
    const effectActions = Pushable(function onClose (error) {
      // cleanup href and/or history
      console.error(error)
    })
    // enable catching <href a=""></href> links
    href(push)
    // enable HTML5 history API
    history(push)

    return effectActions

    function push (href) {
      effectActions.push({
        type: 'SET_LOCATION',
        payload: href
      })
    }
  }
}
