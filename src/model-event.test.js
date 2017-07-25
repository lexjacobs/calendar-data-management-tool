/* global test expect */
import Backbone from 'backbone';
import { timingMapper, serializeTiming, EventModel } from './model-event';

test('it properly removes a timing from the timing property, and maps the result properly to the timing attribute', () => {
  let testModel = new EventModel({
    timing: ['1', '2', '3', '4', '5'],
    repeat: 'banner'
  });

  expect(testModel.get('timing')).toEqual(['1', '2', '3', '4', '5']);
  expect(testModel.timing.models.length).toBe(5);
  testModel.removeTimingByIndex(2);
  expect(testModel.timing.models.length).toBe(4);
  expect(testModel.get('timing')).toEqual(['1', '2', '4', '5']);
  testModel.removeTimingByIndex(2);
  expect(testModel.timing.models.length).toBe(3);
  expect(testModel.get('timing')).toEqual(['1', '2', '5']);
  testModel.removeTimingByIndex(2);
  expect(testModel.timing.models.length).toBe(2);
  expect(testModel.get('timing')).toEqual(['1', '2']);
  testModel.removeTimingByIndex(2);
  expect(testModel.timing.models.length).toBe(2);
  expect(testModel.get('timing')).toEqual(['1', '2']);
  testModel.removeTimingByIndex(2);
  expect(testModel.timing.models.length).toBe(2);
  expect(testModel.get('timing')).toEqual(['1', '2']);
  testModel.removeTimingByIndex(0);
  expect(testModel.timing.models.length).toBe(1);
  expect(testModel.get('timing')).toEqual(['2']);
  testModel.removeTimingByIndex(0);
  expect(testModel.timing.models.length).toBe(0);
  expect(testModel.get('timing')).toEqual([]);
  testModel.removeTimingByIndex(0);
  expect(testModel.timing.models.length).toBe(0);
  expect(testModel.get('timing')).toEqual([]);
});

test('it properly adds and removes banner time blocks', () => {
  let testModel = new EventModel({
    timing: ['9'],
    repeat: 'banner'
  });
  expect(testModel.get('timing')).toEqual(['9']);
  testModel.addNewTiming('10');
  expect(testModel.get('timing')).toEqual(['9', '10']);
  testModel.addNewTiming('10');
  expect(testModel.get('timing')).toEqual(['9', '10', '10']);
  testModel.removeTiming('9');
  expect(testModel.get('timing')).toEqual(['10', '10']);
  testModel.removeTiming('9');
  expect(testModel.get('timing')).toEqual(['10', '10']);
  testModel.removeTiming('4');
  expect(testModel.get('timing')).toEqual(['10', '10']);
  testModel.removeTiming('10');
  expect(testModel.get('timing')).toEqual(['10']);
  testModel.removeTiming('10');
  expect(testModel.get('timing')).toEqual([]);
  testModel.removeTiming('10');
  expect(testModel.get('timing')).toEqual([]);
}) ;
test('it properly adds and removes annual time blocks', () => {
  let testModel = new EventModel({
    timing: ['6-7'],
    repeat: 'annual'
  });
  expect(testModel.get('timing')).toEqual(['6-7']);
  testModel.addNewTiming('4-2');
  expect(testModel.get('timing')).toEqual(['6-7', '4-2']);
  testModel.addNewTiming('11-11');
  expect(testModel.get('timing')).toEqual(['6-7', '4-2', '11-11']);
  testModel.removeTiming('3-4');
  expect(testModel.get('timing')).toEqual(['6-7', '4-2', '11-11']);
  testModel.removeTiming('4-2');
  expect(testModel.get('timing')).toEqual(['6-7', '11-11']);
  testModel.removeTiming('6-7');
  expect(testModel.get('timing')).toEqual(['11-11']);
  testModel.removeTiming('4');
  expect(testModel.get('timing')).toEqual(['11-11']);
  testModel.removeTiming('10');
  expect(testModel.get('timing')).toEqual(['11-11']);
  testModel.removeTiming('11-11');
  expect(testModel.get('timing')).toEqual([]);
  testModel.removeTiming('2016-5-3');
  expect(testModel.get('timing')).toEqual([]);
}) ;
test('it properly adds and removes variable time blocks', () => {
  let testModel = new EventModel({
    timing: ['2001-9-5'],
    repeat: 'variable'
  });
  expect(testModel.get('timing')).toEqual(['2001-9-5']);
  testModel.addNewTiming('2001-4-22');
  expect(testModel.get('timing')).toEqual(['2001-9-5', '2001-4-22']);
  testModel.addNewTiming('2016-11-11');
  expect(testModel.get('timing')).toEqual(['2001-9-5', '2001-4-22', '2016-11-11']);
  testModel.removeTiming('3-4');
  expect(testModel.get('timing')).toEqual(['2001-9-5', '2001-4-22', '2016-11-11']);
  testModel.removeTiming('4-2');
  expect(testModel.get('timing')).toEqual(['2001-9-5', '2001-4-22', '2016-11-11']);
  testModel.removeTiming('2016-11-11');
  expect(testModel.get('timing')).toEqual(['2001-9-5', '2001-4-22']);
  testModel.removeTiming('2001-9-5');
  expect(testModel.get('timing')).toEqual(['2001-4-22']);
  testModel.removeTiming('2001-4-22');
  expect(testModel.get('timing')).toEqual([]);
  testModel.removeTiming('2016-5-3');
  expect(testModel.get('timing')).toEqual([]);
  testModel.addNewTiming('2001-4-22');
  expect(testModel.get('timing')).toEqual(['2001-4-22']);
}) ;

test('it properly serializes time arrays', () => {
  expect(serializeTiming).toBeDefined();

  let testModel = new Backbone.Model({
    y: 2001,
    m: 4,
    d: 22
  });
  expect(serializeTiming([testModel], 'banner')).toEqual(['4']);
  expect(serializeTiming([testModel], 'annual')).toEqual(['4-22']);
  expect(serializeTiming([testModel], 'variable')).toEqual(['2001-4-22']);
});

test('it properly transforms date arrays', () => {
  expect(timingMapper).toBeDefined();
  for (var i = 1; i <= 12; i++) {
    let dateString = '' + i;
    let repetition = 'banner';
    expect(timingMapper(dateString, repetition)).toEqual({m: i});
  }
  let dateString = '13';
  let repetition = 'banner';
  expect(timingMapper(dateString, repetition)).toEqual({m: NaN});
  dateString = '0';
  expect(timingMapper(dateString, repetition)).toEqual({m: NaN});
  dateString = '3-5';
  repetition = 'annual';
  expect(timingMapper(dateString, repetition)).toEqual({
    m: 3,
    d: 5
  });
  dateString = '2019-3-5';
  repetition = 'variable';
  expect(timingMapper(dateString, repetition)).toEqual({
    m: 3,
    d: 5,
    y: 2019
  });
  dateString = '2019-13-5';
  repetition = 'variable';
  expect(timingMapper(dateString, repetition)).toEqual({
    m: NaN,
    d: NaN,
    y: NaN
  });
  dateString = '2019-9-31';
  repetition = 'variable';
  expect(timingMapper(dateString, repetition)).toEqual({
    m: NaN,
    d: NaN,
    y: NaN
  });
  dateString = '123-13-5';
  repetition = 'variable';
  expect(timingMapper(dateString, repetition)).toEqual({
    m: NaN,
    d: NaN,
    y: NaN
  });
});
