const { html, pull } = require('../')
const many = require('pull-many')

// apps as groupoid
module.exports = compose

function compose (apps, template = defaultTemplate) {
  return {

    init () {
      return composeStates(
        apps.map((app) => app.init())
      )
    },

    update (models, actions) {
      return composeStates(
        apps.map((app, i) => {
          const m = models[i]
          const a = actions[i]
          return a ? app.update(m, a) : { model: m }
        })
      )
    },

    view (models, dispatch) {
      const dispatchByApp = i =>
        action => dispatch(item(action, i))

      return template(
        apps.map((app, i) => {
          const m = models[i]
          return app.view(m, dispatchByApp(i))
        })
      )
    },

    run (effects, actions) {
      const nextActions = apps.map((app, i) => {
        const eff = effects[i]
        return eff
          ? pull(
              app.run(eff, () => pull(
                actions(),
                pull.map(value => value[i]),
                pull.filter(isNotNil)
              )) || pull.empty(),
              pull.map(action => item(action, i))
            )
          : pull.empty()
      })
      return many(nextActions)
    }
  }
}

function composeStates (states) {
  console.log('compose state', states)
  return {
    model: states.map(s => s.model),
    effect: states.some(s => s.effect) ?
      states.map(s => s.effect) : null
  }
}

function defaultTemplate (views) {
  return html`
    <div>
    ${
      views.map((view, i) => html`
        <div class=${`app-${i}`}>
          ${view}
        </div>`    
      )
    }
    </div>
  `
}

function isNotNil (x) { return x != null }
function item (value, i) {
  var arr = []
  arr[i] = value
  return arr
}
