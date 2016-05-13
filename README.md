# inu

simple composable unidirectional user interfaces

```shell
npm install --save inu
```

![shiba inu](https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg)

## example

```js
const inu = require('inu')

const app = {

  init: () => ({
    model: 0,
    effect: 'SCHEDULE_TICK' // start perpetual motion
  }),

  update: (model, event) => {
    switch (event) {
      case 'TICK':
        return {
          model: model === 59 ? 0 : model + 1,
          effect: 'SCHEDULE_TICK'
        }
      default:
        return { model }
    }
  },

  view: (model, dispatch) => html`
    <div class='clock'>
      Seconds Elapsed: ${model}
    </div>
  `,

  run: (effect) => {
    switch (effect) {
      case 'SCHEDULE_TICK':
        return pull(
          pull.values(['TICK']),
          delay(1000)
        )
    }
  }
}

const { viewStream } = inu.start(app)

var element
viewStream((view) => {
  if (!element) {
    element = view
    document.body.appendChild(element)
  } else {
    inu.html.update(element, view)
  }
})
```

for a full example of composing multiple apps together, see [source](./example/index.js) and [demo](https://ahdinosaur.github.io/inu).

## usage

where *state* is an object with a required key `model` and an optional key `effect`,

an `app` is defined by an object with the following keys:

- `init`: a function returning the initial state ()
- `update`: a `update(model, event)` pure function, returns the new state
- `view`: a `view(model, dispatch)` pure function, returns the user interface declaration
- `run` (optional): a `run(effect, eventStream)` function, returns an optional [pull source stream](https://github.com/dominictarr/pull-stream) of future events

### `inu = require('inu')`

the top-level `inu` module is a grab bag of all `inu/*` modules.

you can also require each module separately like `require('inu/start')`.

### `streams = inu.start(app)`

streams is an object with the following keys:

- `eventStream`: a [push stream](https://github.com/ahdinosaur/push-stream) for events
- `modelStream`: a [push stream](https://github.com/ahdinosaur/push-stream) for current model
- `viewStream`: a [push stream](https://github.com/ahdinosaur/push-stream) for current view
- `effectStream`: a [push stream](https://github.com/ahdinosaur/push-stream) for current effect
- `nextEventStream`: a [push stream](https://github.com/ahdinosaur/push-stream) for next events to be dispatched

### `inu.html === require('yo-yo')`

### `inu.pull === require('pull-stream')`

## inspiration

- [tom](https://github.com/gcanti/tom)
- [redux-architecture](https://github.com/jarvisaoieong/redux-architecture)
- [elm-architecture-tutorial](https://github.com/evancz/elm-architecture-tutorial)
- [mercury](https://github.com/Raynos/mercury)

## license

The Apache License

Copyright &copy; 2016 Michael Williams

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
