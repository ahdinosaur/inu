const { html } = require('../')

// title demo
module.exports = {

  init: () => ({
    model: 'my demo app'
  }),

  update: (model, action) => {
    switch (action.type) {
      case 'SET':
        return {
          model: action.payload,
          effect: action
        }
      default:
        return { model }
    }
  },

  view: (model, dispatch) => html`
    <div class="title">
      <h1>${model}</h1>
      <label>Set the title</label>
      <input
        type="text"
        placeholder=${model}
        oninput=${(e) => dispatch({
          type: 'SET',
          payload: e.target.value
        })}
      />
    </div>
  `,

  run: (effect) => {
    switch (effect.type) {
      case 'SET':
        document.title = effect.payload
    }
  }
}
