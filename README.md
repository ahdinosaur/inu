# inu

simple composable unidirectional user interfaces using [pull streams](https://github.com/dominictarr/pull-stream)

```shell
npm install --save inu
```

![shiba inu](https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg)

## why?

explained best by [`jarvisaoieong/redux-architecture`](https://github.com/jarvisaoieong/redux-architecture),

> In classical [Redux](https://github.com/reactjs/redux), which side effect is handled by thunk middleware, is not [fractal](http://staltz.com/unidirectional-user-interface-architectures.html) (a term that is nicely explained by @stalz)

> ![](http://i.imgur.com/gRH1uvq.png)

> Even with some new Redux additions, like redux-saga, are also not composable in a fractal way with the rest of architecture.

> I think [elm architecture](https://github.com/evancz/elm-architecture-tutorial/)
has found the proper way to do it right. Beside composing Views, State and Reducers (which are already composed in classical Redux), **Actions** and **Effects** should be composed too. All that leads to composition of application pieces at the higher level.

> ![](http://i.imgur.com/NJWLXHz.png)

## example

```js
const { start, html, pull } = require('inu')

const app = {

  init: () => ({
    model: 0,
    effect: 'SCHEDULE_TICK' // start perpetual motion
  }),

  update: (model, action) => {
    switch (action) {
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

const main = document.querySelector('.main')
const { views } = start(app)

pull(
  views(),
  pull.drain(function (view) {
    html.update(main, view)
  })
)
```

for a full example of composing multiple apps together, see [source](./examples/index.js) and [demo](https://ahdinosaur.github.io/inu).

## usage

where *state* is an object with a required key `model` and an optional key `effect`,

an `app` is defined by an object with the following keys:

- `init`: a function returning the initial state
- `update`: a `update(model, action)` pure function, returns the new state
- `view`: a `view(model, dispatch)` pure function, returns the user interface declaration
- `run` (optional): a `run(effect, actions)` function, returns an optional [pull source stream](https://github.com/dominictarr/pull-stream) of future actions

### `inu = require('inu')`

the top-level `inu` module is a grab bag of all `inu/*` modules.

you can also require each module separately like `require('inu/start')`.

### `streams = inu.start(app)`

streams is an object with the following keys:

- `actions`: a function that returns a [pull source stream](https://github.com/dominictarr/pull-stream) for actions
- `models`: a function that returns a [pull source stream](https://github.com/dominictarr/pull-stream) for models
- `views`: a function that returns a [pull source stream](https://github.com/dominictarr/pull-stream) for views
- `effects`: a function that returns a [pull source stream](https://github.com/dominictarr/pull-stream) for effects
- `nextActions`: a function that returns a [pull source stream](https://github.com/dominictarr/pull-stream) for next actions to be dispatched

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
