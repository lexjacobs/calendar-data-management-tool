import Backbone from 'backbone';
// import dataset from './dataset';
import eventModel from './model-event';
import { Firebase } from './firebase';

var events = Firebase.database().ref('events');

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
