import 'bootstrap/dist/css/bootstrap.css';
import Backbone from 'backbone';
import ApplicationRouter from './router';
import { Firebase } from './firebase';
import database from './collection-database';

console.log('initializing router');
export const router = new ApplicationRouter();

// initialize on load
var events = Firebase.database().ref('events');
events.once('value', (snapshot) => {
  console.log('database values', snapshot.val());
  database.reset();
  database.add(snapshot.val());
  console.log('starting Backbone history');
  Backbone.history.start();
});
