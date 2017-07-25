import Backbone from 'backbone';

import eventModel from './model-event';
import { Firebase } from './firebase';
var events = Firebase.database().ref('events');

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
