const { html } = require('../')

// title demo
module.exports = {

  init: () => ({
    model: []
  }),

  update: {
    add: (todos, action) => ({ todos: todos.concat(action.todo) }),
    set: (todos, action) => ({ todos: todos.splice(index, action.id, action.todo)})
  },

  view: (model, dispatch) => html`
    <div class="todos">
      <h1>${model.length} things to do</h1>
      <ul>
        ${model.map((todo, id) => html`
          <input
            type="text"
            placeholder=${todo.text}
            oninput=${(e) => dispatch('todos:set', {
              id, e.target.value
            })}
          />
        `)}
      </ul>
      <button
        onclick=${(e) => {
          return dispatch('todos:add', {
            todo: "something to do."
          })
      />
    </div>
  `,
}
