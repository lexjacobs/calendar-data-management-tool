import 'bootstrap/dist/css/bootstrap.css';
import Backbone from 'backbone';
import ApplicationRouter from './router';
import { Firebase } from './firebase';
import database from './collection-database';
import Logout from './view-logout';

var LOGGED_IN = false;

export const router = new ApplicationRouter();

Backbone.history.start();

const logout = new Logout({
  el: '#logout-container'
});

var events = Firebase.database().ref('events');
var version = Firebase.database().ref('version');

Firebase.auth().onAuthStateChanged(function (user) {

  if (user) {
    LOGGED_IN = true;
    logout.model.set({
      authorized: true
    });

    events.on('value', (snapshot) => {

      // set integrity signature to ensure most recent version of software
      version.once('value').then(x => {
        sessionStorage.setItem('currentVersion', x.val());

        // and hydrate database from firebase
        database.initialLoad = true;
        database.reset(snapshot.val());

        // 'update' is being listenTo'd by views that will then re-render
        database.trigger('update');
      });

    });

  } else {
    LOGGED_IN = false;

    // clear client database (does not affect firebase)
    database.reset();
    logout.model.set({
      authorized: false
    });
    router.navigate('#/login');
  }
});

// don't allow loading of other views without first logging in
router.on('route', function(){
  if (!LOGGED_IN) {
    this.navigate('#/login');
  }
});
