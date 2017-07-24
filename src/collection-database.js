import Backbone from 'backbone';

// uncomment to repopulate firebase from data set
// import dataset from './dataset';

import eventModel from './model-event';
import { Firebase } from './firebase';
var events = Firebase.database().ref('events');

// test: add a new event
// test: change the event timing

// var test = new eventModel({
//   text: 'test event banner repeat',
//   timing: ['10'],
//   repeat: 'banner',
//   shading: 'diagonal',
//   mlh: 'yes',
//   proclamation: 'yes',
//   previousSundown: 'yes',
//   asp: 'yes'
// });
//
// setTimeout(function () {
//   console.log('timout 1');
//   database.add(test);
// }, 3000);
//
//
// setTimeout(function () {
//   console.log('timout 2');
// // database.last().set('text', 'event model sample text changed')
//   database.last().addNewTiming(['9']);
//   database.last().addNewTiming(['11']);
// }, 5000);
//
//
// setTimeout(_ => {
//   console.log('timout 3');
//   database.pop();
//
// }, 10000);

// end tests


const Database = Backbone.Collection.extend({
  initialize() {
    this.listenTo(this, 'change', function (x) {
      this.answer('change', x);
    }, this);
    this.listenTo(this, 'update', function (x) {
      this.answer('update', x);
    }, this);

  },
  updateFirebase() {
    events.set(this.toJSON());
    this.trigger('updated');
  },
  answer(event, cb) {
    console.log('database collection heard', event, cb);

    // avoid deleting database in case of race condition where client
    // adds to collection prior to db hydrating from firebase
    if (this.length < 2) {
      if (window.confirm('Confirm delete - this will leave the database with 2 or less items.')) {
        console.log('as instructed, db will be <= 2 items now.');
        this.updateFirebase();
      } else {
        console.log('avoided db overwrite disaster!');
        return null;
      }
    } else {
      this.updateFirebase();
    }
  },
  model: eventModel
});

const database = new Database();

export default database;
