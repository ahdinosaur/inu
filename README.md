<h1 align="center">
  <img
    alt="Doge, the shiba inu"
    src="http://i3.kym-cdn.com/photos/images/original/000/581/296/c09.jpg"
    width="300"
  />
  <br />
  inu
</h1>

<h4 align="center">
  :dog2: composable unidirectional user interfaces using <a href="https://pull-stream.github.io">pull streams</a>
</h4>

<div align="center">
  <!-- stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="stability" />
  </a>
  <!-- npm version -->
  <a href="https://npmjs.org/package/inu">
    <img src="https://img.shields.io/npm/v/inu.svg?style=flat-square" alt="npm version" />
  </a>
  <!-- build status -->
  <a href="https://travis-ci.org/ahdinosaur/inu">
    <img src="https://img.shields.io/travis/ahdinosaur/inu/master.svg?style=flat-square" alt="build status" />
  </a>
  <!-- test coverage -->
  <a href="https://codecov.io/github/ahdinosaur/inu">
    <img src="https://img.shields.io/codecov/c/github/ahdinosaur/inu/master.svg?style=flat-square" alt="test coverage" />
  </a>
  <!-- downloads -->
  <a href="https://npmjs.org/package/inu">
    <img src="https://img.shields.io/npm/dm/inu.svg?style=flat-square"
      alt="Downloads" />
  </a>
  <!-- standard style -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="standard style" />
  </a>
</div>

<details>
  <summary>table of contents</summary>
  <li><a href="#features">features</a></li>
  <li><a href="#demos">demos</a></li>
  <li><a href="#example">example</a></li>
  <li><a href="#concepts">concepts</a></li>
  <li><a href="#api">api</a></li>
  <li><a href="#install">install</a></li>
  <li><a href="#inspiration">inspiration</a></li>
</details>

## features

- **minimal size**: `inu` + [`yo-yo`](https://github.com/maxogden/yo-yo) + [`pull-stream`](https://github.com/pull-stream/pull-stream) weighs only ~8kb
- **app is a data structure**: only need to learn 4 functions, automatically supports plugins
- [**architecture is fractal**](https://github.com/jarvisaoieong/redux-architecture#redux-architecture): compose one app from many smaller apps
- [**single source of truth**](http://redux.js.org/docs/introduction/ThreePrinciples.html#single-source-of-truth): the state of your app is a single object tree
- [**state is read-only**](http://redux.js.org/docs/introduction/ThreePrinciples.html#state-is-read-only): update state by dispatching an action, an object describing what happened
- [**update with pure functions**](http://redux.js.org/docs/introduction/ThreePrinciples.html#changes-are-made-with-pure-functions): updates are handled by a pure function, no magic
- **first-class side effects**: initial state or updates can include an effect, an object describing what will happen
- **omakase**: consistent flavoring with [pull streams](https://pull-stream.github.io) all the way down

## demos

- [./examples/clock](./examples/clock.js): simple app to count seconds
- [./examples/title](./examples/title.js): simple app to change document.title
- [./examples/routing](./examples/routing.js): url routing with [`sheet-router`](https://github.com/yoshuawuyts/sheet-router)
- [./examples/compose](./examples/compose.js): multiplex many apps into one app
- [./examples/counter](./examples/counter.js): simple counter expressed in standard redux pattern
- [./examples](./examples/index.js): above examples composed into one app deployed at <http://dinosaur.is/inu>.
- [pietgeursen/ssb-gathering-ui](https://github.com/pietgeursen/ssb-gathering-ui): Facebook-style events using [`inu`](./), [`muxrpc`](https://github.com/ssbc/muxrpc), [`sheetify`](https://github.com/stackcss/sheetify), [`tcomb`](https://github.com/gcanti/tcomb) and other fun stuff.
- [pietgeursen/inu-fft](https://github.com/pietgeursen/inu-fft): Little inu app with fft of microphone input
- [ahdinosaur/inu-plays-roguelike](https://github.com/ahdinosaur/inu-plays-roguelike): ['Twitch Plays Pokémon'](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon)-style ['Roguelike'](https://en.wikipedia.org/wiki/Roguelike) game using [`inu`](https://github.com/ahdinosaur/inu), [`tcomb`](https://github.com/gcanti/tcomb), and things.
- [holodex/app#compost](https://github.com/holodex/app/tree/compost): full-stack user directory app using [`inu`](./), [`inux`](https://github.com/ahdinosaur/inux), and [`vas`](https://github.com/ahdinosaur/vas).

*if you want to share anything using `inu`, add your thing here!*

## example

```js
const { State, Action, Effect } = require('inu')
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

  run: (effect, sources) => {
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

## concepts

TODO

## api

### `inu = require('inu')`

the top-level `inu` module is a grab bag of all `inu/*` modules.

you can also require each module separately like `require('inu/state')`.

### `stateModule = inu.State(definiton)`
### `actionModule = inu.Action(definiton)`
### `effectModule = inu.Effect(definiton)`

## install

```shell
npm install --save inu
```

## see also

- [`inu-engine`](https://github.com/ahdinosaur/inu-engine)

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
