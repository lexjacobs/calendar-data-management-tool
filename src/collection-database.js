import Backbone from 'backbone';

// uncomment to repopulate firebase from data set
// WARNING: DESTRUCTIVE OPERATION!
// import dataset from './dataset';

import eventModel from './model-event';
import { Firebase } from './firebase';
var events = Firebase.database().ref('events');
var lastUpdate = Firebase.database().ref('lastUpdate');

const Database = Backbone.Collection.extend({
  initialize() {
    this.initialLoad = false;
    this.listenTo(this, 'change', function (x) {
      this.answer('change', x);
    }, this);
    this.listenTo(this, 'update', function (x) {
      this.answer('update', x);
    }, this);

  },
  integrityCheck() {
    return lastUpdate.once('value');
  },
  updateFirebase() {

    this.integrityCheck()
      .then(x => {
        if (+x.val() === +sessionStorage.getItem('lastUpdate')) {
          events.set(this.toJSON());
          this.trigger('updated');
        } else {
          alert('Not applying most recent update because it would overwrite previous changes. (Perhaps an event was created or updated in a different tab/window?). Refresh browser to fix');
          return;
        }
      })
      .catch(e => {
        console.log('in integrity check error', e);
      });
  },
  answer() {
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
