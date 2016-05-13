const html = require('yo-yo')

// title demo
module.exports = {

  init: () => ({
    model: 'my demo app'
  }),

  update: (model, event) => {
    console.log('model', model, event)
    switch (event.type) {
      case 'SET':
        return {
          model: event.payload,
          effect: {
            type: 'DO_SET',
            payload: event.payload
          }
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

  run: (effect) =>  {
    switch (effect.type) {
      case 'DO_SET':
        document.title = effect.payload
    }
  }
}
