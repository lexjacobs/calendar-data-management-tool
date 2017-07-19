import { timingMapper } from './model-event';

test('it properly transforms date arrays', () => {
  expect(timingMapper).toBeDefined();
  for (var i = 1; i <= 12; i++) {
    let dateString = '' + i
    let repetition = 'banner'
    expect(timingMapper(dateString, repetition)).toEqual({m: i});
  }
  let dateString = '13'
  let repetition = 'banner'
  expect(timingMapper(dateString, repetition)).toEqual({m: NaN});
  dateString = '0'
  expect(timingMapper(dateString, repetition)).toEqual({m: NaN});
  dateString = '3-5'
  repetition = 'annual'
  expect(timingMapper(dateString, repetition)).toEqual({
    m: 3,
    d: 5
  });
  dateString = '2019-3-5'
  repetition = 'variable'
  expect(timingMapper(dateString, repetition)).toEqual({
    m: 3,
    d: 5,
    y: 2019
  });
  dateString = '2019-13-5'
  repetition = 'variable'
  expect(timingMapper(dateString, repetition)).toEqual({
    m: NaN,
    d: NaN,
    y: NaN
  });
  dateString = '2019-9-31'
  repetition = 'variable'
  expect(timingMapper(dateString, repetition)).toEqual({
    m: NaN,
    d: NaN,
    y: NaN
  });
  dateString = '123-13-5'
  repetition = 'variable'
  expect(timingMapper(dateString, repetition)).toEqual({
    m: NaN,
    d: NaN,
    y: NaN
  });
});
