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

imagine your app’s current state is described as a plain object. for example, the initial state of a todo app might look like this:

```js
var initState = {
  model: {
    todos: [{
      text: 'Eat food',
      completed: true
    }, { 
      text: 'Exercise',
      completed: false
    }],
    visibilityFilter: 'SHOW_COMPLETED'
  },
  effect: 'FETCH_TODOS'
}
```

this state object describes the _model_ (a list of todo items and an option for how to filter these items) and any optional _effect_ (we immediately want to fetch for any new todo items).

to change something in the state, we need to dispatch an action. an action is a plain JavaScript object (notice how we don’t introduce any magic?) that describes what happened. here are a few example actions:

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
{ type: 'LOAD_TODOS' }
```

enforcing that every change is described as an action lets us have a clear understanding of what’s going on in the app. if something changed, we know why it changed. actions are like breadcrumbs of what has happened.

finally, to tie state and actions together, we write an _update_ function. again, nothing magic about it — it’s just a function that takes the model and action as arguments, and returns the next state of the app.

it would be hard to write such a function for a big app, so we write smaller functions managing parts of the state:

```js
function visibilityFilter (model, action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter
  } else {
    return { model }
  }
}

function todos (model, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { model: model.concat([{ text: action.text, completed: false }]) }
    case 'TOGGLE_TODO':
      return {
        model: model.map((todo, index) =>
          action.index === index ?
            { text: todo.text, completed: !todo.completed } :
            todo
        )
      }
    case 'LOAD_TODOS':
      return { model, effect: 'FETCH_TODOS' }
    default:
      return { model }
  }
}
```

and we write another update function that manages the complete state of our app by calling those two update functions for the corresponding state keys:

```js
function appUpdate (model, action) {
  const todosState = todos(model.todos, action)
  const visibilityFilterState = visibilityFilter(model.visibilityFilter, action)

  return {
    model: {
      todos: todosState.model,
      visibilityFilter: visibilityFilter.model
    },
    effect: todosState.effect
  }
}
```

if any effect is returned by an update function, we want to run it. this run functions is able to listen to any future changes and return a stream of any new actions.

here's how we handle our effect to fetch any todos, using [`pull-stream`](https://github.com/pull-stream/pull-stream) as `pull`:

```js
function appRun (effect, sources) {
  if (effect === 'FETCH_TODOS') {
    return pull(
      fetchTodos(),
      pull.map(todo => {
        return {
          type: 'ADD_TODO',
          text: todo.text
        }
      })
    )
  }
}
```

now that we have our state, changes, and side effects managed in a predictable (and easy-to-test) way, we want to view our epic todo list.

here's a simplified view using [`yo-yo`](https://github.com/maxogden/yo-yo) as `html`:

```js
function appView (model, dispatch) {
  return html`
    <div class='todos'>
      ${model.todos.map((todo, index) => html`
        <div class='todo'>
          ${todo.text}
          <button onclick=${toggleTodo(index)}
        </div>
      `)}
    </div>
  `

  function toggleTodo (index) {
    return (ev) => dispatch({ 'TOGGLE_TODO', })
  }
}
```

put it all together and we have an `inu` app!

```js
const app = {
  init: () => initState,
  update: appUpdate,
  view: appView,
  run: appRun
}
```

that's it for `inu`. note that we're only using plain functions and objects. `inu` (and [`inux`](https://github.com/ahdinosaur/inux)) come with a few utilities to facilitate this pattern, but the main idea is that you describe how your state is updated over time in response to action objects, and 90% of the code you write is just plain JavaScript, with no use of `inu` itself, its APIs, or any magic.

([credit @gaearon of `redux` for initial source of this intro](https://www.reddit.com/r/reactjs/comments/4npzq5/confused_redux_or_mobx/d46k2bl))

## api

where *state* is an object with a required key `model` and an optional key `effect`,

an `inu` app is defined by an object with the following (optional) keys:

- `init`: a function returning the initial state
- `update`: a `update(model, action)` pure function, returns the new state
- `view`: a `view(model, dispatch)` pure function, returns the user interface declaration
- `run`: a `run(effect, sources)` function, returns an optional [pull source stream](https://pull-stream.github.io) of future actions

### `inu = require('inu')`

the top-level `inu` module is a grab bag of all `inu/*` modules.

you can also require each module separately like `require('inu/start')`.

### `sources = inu.start(app)`

sources is an object with the following keys:

- `actions`: a function that returns a [pull source stream](https://pull-stream.github.io) for actions
- `states`: a function that returns a state-ful\* [pull source stream](https://pull-stream.github.io) for states
- `models`: a function that returns a state-ful\* [pull source stream](https://pull-stream.github.io) for models
- `views`: a function that returns a state-ful\* [pull source stream](https://pull-stream.github.io) for views
- `effects`: a function that returns a state-ful\* [pull source stream](https://pull-stream.github.io) for effects
- `effectActionsSources`: a function that returns a [pull source stream](https://pull-stream.github.io) for any sources of next actions caused by effects

![streams flow diagram](https://rawgit.com/ahdinosaur/inu/master/assets/flow-diagram.dot.svg)

\* in this context, *state-ful* means that the pull source stream will always start with the last value (if any) first.

### [`inu.html === require('yo-yo')`](https://github.com/maxogden/yo-yo) (for templating, virtual DOM "diffing")

### [`inu.pull === require('pull-stream')`](https://pull-stream.github.io) (for async event "piping")

## install

```shell
npm install --save inu
```

## inspiration

- [tom](https://github.com/gcanti/tom): `inu`'s implementation is more or less a direct port of [`tom`](https://github.com/gcanti/tom) using [pull streams](https://pull-stream.github.io) instead of [rx](https://www.npmjs.com/package/rx)
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
