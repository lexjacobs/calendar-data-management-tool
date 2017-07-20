import Backbone from 'backbone';

// uncomment to repopulate firebase from data set
// import dataset from './dataset';

import eventModel from './model-event';
import { Firebase } from './firebase';

var events = Firebase.database().ref('events');


// test: add a new event
// test: change the event timing

// var test = new eventModel({
//   text: 'test event for half shading',
//   timing: ['2016-09-04'],
//   repeat: 'variable',
//   shading: 'half'
// })
//
// setTimeout(function () {
//   console.log('timout 1');
//   database.add(test);
// }, 1500);


// setTimeout(function () {
//   console.log('timout 2');
//   database.last().set('text', 'event model sample text changed')
//     database.last().addNewTiming(['2016-9-15']);
// }, 3000);
//
//
// setTimeout(_ => {
//   console.log('timout 3');
//   database.pop();
//
// }, 5000)

// end tests


const Database = Backbone.Collection.extend({
  initialize() {
    this.listenTo(this, 'change', function (x) {
      this.answer('change', x);
    }, this);
    this.listenTo(this, 'add', function (x) {
      this.answer('add', x);
    }, this);
    this.listenTo(this, 'update', function (x) {
      this.answer('update', x);
    }, this);

  },
  answer(event, cb) {
    // console.log('heard', event, cb);
    var events = Firebase.database().ref('events');
    events.set(this.toJSON());
    this.trigger('updated')
  },
  model: eventModel
});

const database = new Database();

// initialize on load
events.once('value', (snapshot) => {
  console.log('database values', snapshot.val());
  database.reset();
  database.add(snapshot.val());
});

export default database;
