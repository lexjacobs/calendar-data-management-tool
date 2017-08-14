/* global test expect */
import { Firebase } from './firebase';

test('it writes to the database', (done) => {
  let unknown = Firebase.database().ref('version');
  unknown.once('value', (snapshot) => {
    expect(snapshot.val()).toBe(null);
    done();
  });
});
