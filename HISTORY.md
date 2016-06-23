# `3.0.0` (23 June 2016)

small (but still breaking) changes made while writing [`inu-plays-roguelike`](https://github.com/ahdinosaur/inu-plays-roguelike):

- [rename `streams` returned by `start` to `sources`](https://github.com/ahdinosaur/inu/commit/4faecd8b9fdb34a8ec60a22f1c3fa93e2ceaae67)
- [`run` function receives all sources streams](https://github.com/ahdinosaur/inu/commit/f339622b12e39fd1ee15084cdbe8b76f85813688)
- [replay last value for 'state-ful' sources](https://github.com/ahdinosaur/inu/commit/5e88de8b06bfab585eab5e960d3559242c5a4ee6)

# `2.0.0` (13 May 2016)

due to difficult in writing `./examples/compose.js` with `push-stream`, re-write using [`pull-stream`](https://pull-stream.github.io), thanks to [`pull-notify`](https://pull-stream.github.io/#pull-notify).

# `1.0.0` (12 May 2016)

more or less a direct port of [`gcanti/tom`](https://github.com/gcanti/tom) using [`push-stream`](https://github.com/ahdinosaur/push-stream) instead of [`rx`](https://www.npmjs.com/package/rx)
