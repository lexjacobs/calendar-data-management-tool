import Backbone from 'backbone';

// uncomment to repopulate firebase from data set
// import dataset from './dataset';

import eventModel from './model-event';
import { Firebase } from './firebase';
var events = Firebase.database().ref('events');

// var events = Firebase.database().ref('events');


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
// })
//
// setTimeout(function () {
//   console.log('timout 1');
//   database.add(test);
// }, 3000);
//
//
// setTimeout(function () {
//   console.log('timout 2');
//   // database.last().set('text', 'event model sample text changed')
//     database.last().addNewTiming(['9']);
//     database.last().addNewTiming(['11']);
// }, 5000);
//
//
// setTimeout(_ => {
//   console.log('timout 3');
//   database.pop();
//
// }, 10000)

// end tests


const Database = Backbone.Collection.extend({
  initialize() {
    this.listenTo(this, 'change', function (x) {
      this.answer('change', x);
    }, this);
    // this.listenTo(this, 'add', function (x) {
    //   this.answer('add', x);
    // }, this);
    this.listenTo(this, 'update', function (x) {
      this.answer('update', x);
    }, this);

  },
  answer(event, cb) {
    console.log('database collection heard', event, cb);
    events.set(this.toJSON());
    this.trigger('updated')
  },
  model: eventModel
});

const database = new Database();

// // initialize on load
// events.once('value', (snapshot) => {
//   console.log('database values', snapshot.val());
//   database.reset();
//   database.add(snapshot.val());
// });

export default database;
