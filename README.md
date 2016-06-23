# inu [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

simple composable unidirectional user interfaces using [pull streams](https://pull-stream.github.io)

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

`inu`'s implementation is more or less a direct port of [`tom`](https://github.com/gcanti/tom) using [pull streams](https://pull-stream.github.io) instead of [rx](https://www.npmjs.com/package/rx).

## example

```js
const { start, html, pull } = require('inu')
const delay = require('pull-delay')

const app = {

  init: () => ({
    model: 0,
    effect: 'SCHEDULE_TICK' // start perpetual motion
  }),

  update: (model, action) => {
    switch (action) {
      case 'TICK':
        return {
          model: (model + 1) % 60,
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

an `inu` app is defined by an object with the following (optional) keys:

- `init`: a function returning the initial state
- `update`: a `update(model, action)` pure function, returns the new state
- `view`: a `view(model, dispatch)` pure function, returns the user interface declaration
- `run`: a `run(effect, actions)` function, returns an optional [pull source stream](https://pull-stream.github.io) of future actions

### `inu = require('inu')`

the top-level `inu` module is a grab bag of all `inu/*` modules.

you can also require each module separately like `require('inu/start')`.

### `streams = inu.start(app)`

streams is an object with the following keys:

- `actions`: a function that returns a [pull source stream](https://pull-stream.github.io) for actions
- `states`: a function that returns a state-ful\* [pull source stream](https://pull-stream.github.io) for states
- `models`: a function that returns a state-ful\* [pull source stream](https://pull-stream.github.io) for models
- `views`: a function that returns a state-ful\* [pull source stream](https://pull-stream.github.io) for views
- `effects`: a function that returns a state-ful\* [pull source stream](https://pull-stream.github.io) for effects
- `effectActionsSources`: a function that returns a [pull source stream](https://pull-stream.github.io) for any streams of next actions caused by effects

![streams flow diagram](https://rawgit.com/ahdinosaur/inu/master/assets/flow-diagram.dot.svg)

\* in this context, *state-ful* means that the pull source stream will always start with the last value (if any) first.

### [`inu.html === require('yo-yo')`](https://github.com/maxogden/yo-yo)

### [`inu.pull === require('pull-stream')`](https://pull-stream.github.io)

## examples

- [./examples/clock](./examples/clock.js): simple app to count seconds
- [./examples/title](./examples/title.js): simple app to change document.title
- [./examples/routing](./examples/routing.js): url routing with [`sheet-router`](https://github.com/yoshuawuyts/sheet-router)
- [./examples/compose](./examples/compose.js): multiplex many apps into one app
- [./examples/counter](./examples/counter.js): simple counter expressed in standard redux pattern
- [./examples](./examples/index.js): above examples composed into one app deployed at <http://dinosaur.is/inu>.
- [pietgeursen/ssb-gathering-ui](https://github.com/pietgeursen/ssb-gathering-ui): Facebook-style events using [`inu`](./), [`muxrpc`](https://github.com/ssbc/muxrpc), [`sheetify`](https://github.com/stackcss/sheetify), [`tcomb`](https://github.com/gcanti/tcomb) and other fun stuff.
- [ahdinosaur/inu-plays-roguelike](https://github.com/ahdinosaur/inu-plays-roguelike): ['Twitch Plays Pokémon'](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon)-style ['Roguelike'](https://en.wikipedia.org/wiki/Roguelike) game using [`inu`](https://github.com/ahdinosaur/inu), [`tcomb`](https://github.com/gcanti/tcomb), and things.

## inspiration

- [tom](https://github.com/gcanti/tom)
- [redux-architecture](https://github.com/jarvisaoieong/redux-architecture)
- [elm-architecture-tutorial](https://github.com/evancz/elm-architecture-tutorial)
- [mercury](https://github.com/Raynos/mercury)
- [vdux](https://github.com/vdux/vdux)

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

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/inu.svg?style=flat-square
[3]: https://npmjs.org/package/inu
[4]: https://img.shields.io/travis/ahdinosaur/inu/master.svg?style=flat-square
[5]: https://travis-ci.org/ahdinosaur/inu
[6]: https://img.shields.io/codecov/c/github/ahdinosaur/inu/master.svg?style=flat-square
[7]: https://codecov.io/github/ahdinosaur/inu
[8]: http://img.shields.io/npm/dm/inu.svg?style=flat-square
[9]: https://npmjs.org/package/inu
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
