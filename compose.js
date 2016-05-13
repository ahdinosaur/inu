const { html, pull } = require('../')
const cat = require('pull-cat')

// apps as groupoid
module.exports = compose

function compose ([x, y], template = defaultTemplate) {
  return {

    init () {
      return composeStates(x.init(), y.init())
    },

    update ([mx, my], [ex, ey]) {
      return composeStates(
        ex ? x.update(mx, ex) : { model: mx },
        ey ? y.update(my, ey) : { model: my }
      )
    },

    view ([mx, my], dispatch) {
      const dispatchX = action => dispatch([action])
      const dispatchY = action => dispatch([null, action])

      return template(
        x.view(mx, dispatchX),
        y.view(my, dispatchY)
      )
    },

    run ([effx, effy], actions) {
      const nextActionsX = (effx && x.run) ? pull(
        x.run(effx, () => pull(
          actions(),
          pull.map(value => value[0]),
          pull.filter(isNotNil)
        )) || pull.empty(),
        pull.map(action => [action])
      ) : pull.empty()
      const nextActionsY = (effy && y.run) ? pull(
        y.run(effy, () => pull(
          actions(),
          pull.map(value => value[1]),
          pull.filter(isNotNil)
        )) || pull.empty(),
        pull.map(action => [null, action])
      ) : pull.empty()
      return cat([nextActionsX, nextActionsY])
    }
  }
}

function composeStates (x, y) {
  console.log('compose state', x, y)
  return {
    model: [x.model, y.model],
    effect: x.effect || y.effect ? [x.effect, y.effect] : null
  }
}

function defaultTemplate (x, y) {
  return html`
    <div>${x} ${y}</div>
  `
}

function isNotNil (x) { return x != null }
