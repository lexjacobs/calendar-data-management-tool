/* global test expect */
import { serializedAttributes, serializedObject } from './shared';
import $ from 'jquery';

test('it pulls the proper attributes from a serialized array', () => {

  let testElement = `<form class="testForm">
  <input value="value a" name="a" />
  <input value="value b" name="b" />
  <input value="value c" name="c" />
  <input value="value d" name="d" />
  </form>`;

  let serializedTestElement = $(testElement).serializeArray();

  expect(serializedAttributes(serializedTestElement, 'a')).toEqual('value a');
  expect(serializedAttributes(serializedTestElement, 'b')).toEqual('value b');
  expect(serializedAttributes(serializedTestElement, 'c')).toEqual('value c');
  expect(serializedAttributes(serializedTestElement, 'd')).toEqual('value d');
  expect(serializedAttributes(serializedTestElement, 'e')).toEqual(undefined);
});
test('it transforms the serialized array into an object with appropriate key/value pairs', () => {

  let testElement = `<form class="testForm">
  <input value="value a" name="a" />
  <input value="value b" name="b" />
  <input value="value c" name="c" />
  <input value="value d" name="d" />
  </form>`;

  let serializedTestElement = $(testElement).serializeArray();

  expect(serializedObject(serializedTestElement)).toEqual({
    a: 'value a',
    b: 'value b',
    c: 'value c',
    d: 'value d',
  });
  expect(serializedObject(serializedTestElement).a).toEqual('value a');
  expect(serializedObject(serializedTestElement).b).toEqual('value b');
  expect(serializedObject(serializedTestElement).c).toEqual('value c');
  expect(serializedObject(serializedTestElement).d).toEqual('value d');
  expect(serializedObject(serializedTestElement).e).toEqual(undefined);
});
