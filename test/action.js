const test = require('tape')

const action = require('../action')

test('action(object) -> object', (t) => {
  const type = 'EXPECTED_ACTION'
  const payload = 'things and stuff'
  const expected = { type, payload }
  const actual = action({ type, payload })
  t.deepEqual(actual, expected, 'action is correct.')
  t.end()
})

test('action(type, object) -> ({ type, ...object })', (t) => {
  const type = 'EXPECTED_ACTION'
  const payload = 'things and stuff'
  const expected = { type, payload }
  const actual = action(type, { payload })
  t.deepEqual(actual, expected, 'action is correct.')
  t.end()
})
