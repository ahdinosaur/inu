const html = require('yo-yo')
const push = require('push-stream')
const pull = require('pull-stream')
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
      const dispatchX = event => dispatch([event])
      const dispatchY = event => dispatch([null, event])

      return template(
        x.view(mx, dispatchX),
        y.view(my, dispatchY)
      )
    },

    run ([effx, effy], eventStream) {
      // TODO this is too much code
      const eventXStream = push.stream()
      var nextEventXStream = pull.empty()
      if (effx && x.run) {
        // TODO how to destroy push streams listeners when done?
        push(
          eventStream,
          push.map(value => value[0]),
          push.filter(isNotNil),
          eventXStream
        )
        nextEventXStream = pull(
          x.run(effx, eventXStream) || nextEventXStream,
          pull.map(event => [event])
        )
      }

      const eventYStream = push.stream()
      var nextEventYStream = pull.empty()
      if (effy && y.run) {
        // TODO how to destroy push streams listeners when done?
        push(
          eventStream,
          push.map(value => value[1]),
          push.filter(isNotNil),
          eventYStream
        )
        nextEventYStream = pull(
          y.run(effy, eventYStream) || nextEventYStream,
          pull.map(event => [null, event])
        )
      }
      return cat([nextEventXStream, nextEventYStream])
    }
  }
}

function composeStates (x, y) {
  console.log(x, y)
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
