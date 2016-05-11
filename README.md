# pull-app

modular user interfaces using [pull streams](https://github.com/dominictarr/pull-streams)

```shell
npm install --save pull-app
```

inspired by:

- [tom](https://github.com/gcanti/tom)
- [redux-architecture](https://github.com/jarvisaoieong/redux-architecture)
- [elm-architecture-tutorial](https://github.com/evancz/elm-architecture-tutorial)

## example

see [./example](https://ahdinosaur.github.io/pull-app)

## usage

where *state* is an object with a required key `model` and an optional key `effect`,

an `app` is defined by an object with the following keys:

- `init`: a function returning the initial state ()
- `update`: a `update(model, event)` pure function, returns the new state
- `view`: a `view(model, dispatch)` pure function, returns the user interface declaration
- `run` (optional): a `run(effect, eventStream)` function, returns an optional source stream of future events

### `start = require('pull-app')`

### `start(app)`

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
