/* global test expect */
import { Database } from './collection-database';
import { startFirebaseTestServer } from './test-server';
import dataset from './dataset';
import { Firebase } from './firebase';

var ref;
var server;

beforeAll(async () => {
  ({ ref, server } = await startFirebaseTestServer());
});

test('expect database to have a length that changes based on adding items', () => {
  let database = new Database();
  expect(database).toBeDefined();
  expect(database.length).toBe(0);
  database.add({hi: 'bye'}, {silent: true});
  database.add({hi: 'bye'});
  database.add({hi: 'bye'});
  expect(database.length).toBe(3);
  database.pop();
  expect(database.length).toBe(2);
  database.pop({silent: true});
  expect(database.length).toBe(1);
  database.pop({silent: true});
  expect(database.length).toBe(0);
  database.pop({silent: true});
  expect(database.length).toBe(0);
  database.add({hi: 'bye'}, {silent: true});
  expect(database.length).toBe(1);
});

test('database can be hydrated from firebase', (done) => {
  let database = new Database();
  let events = ref.child('events');

  let testLength = dataset.length;

  events.set(dataset);
  events.once('value').then(snapshot => {
    database.reset(snapshot.val());
    expect(database.length).toBe(testLength);
    database.add({something: 'else'});
    expect(database.length).toBe(testLength + 1);
    done();
  })
});

test('updating database updates firebase', (done) => {
  let database = new Database();
  expect(database.length).toBe(0);
  let events = ref.child('events');

  let testLength = dataset.length;

  events.set(dataset);
  events.on('value', snapshot => {
    expect(snapshot.val().length).toBe(testLength);
    done();
  })
});

test('updateFirebase updates firebase', () => {
  let database = new Database();
  database.reset(dataset);
  expect(database.length).toBe(dataset.length);
});
