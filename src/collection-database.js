import Backbone from 'backbone';

// uncomment to repopulate firebase from data set
// WARNING: DESTRUCTIVE OPERATION!
// import dataset from './dataset';

import eventModel from './model-event';
import { Firebase } from './firebase';
var events = Firebase.database().ref('events');
var version = Firebase.database().ref('version');

export const Database = Backbone.Collection.extend({
  initialize() {

    // will be set to true in index.js, after database is hydrated
    this.initialLoad = false;
    this.listenTo(this, 'update', function() {
      this.avoidDatabaseDestruction();
    }, this);
  },
  integrityCheck() {
    return version.once('value');
  },
  updateFirebase() {

    // allows developer to make significant changes to software
    // and increment 'version' key directly in firebase, preventing
    // database writes without client refresh for latest code
    this.integrityCheck()
      .then(x => {
        if (+x.val() === +sessionStorage.getItem('currentVersion')) {

          // use this to remove an attribute if needed
          // this.models = this.models.map(x => {
          //   delete x.attributes.notes;
          //   return x;
          // });

          events.set(this.toJSON());
          this.trigger('updated');
        } else {
          alert('Not applying most recent update because you are not using the most recent version of the software. Refresh browser to fix.');
          return;
        }
      })
      .catch(e => {
        console.log('in integrity check error', e);
      });
  },
  avoidDatabaseDestruction() {

    // avoid deleting database in case of race condition where client
    // adds to collection prior to db hydrating from firebase
    if (this.length < 2) {
      if (window.confirm('Confirm delete - this will leave the database with 1 or less items.')) {
        console.log('as instructed, db will be <= 1 items now.');
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
