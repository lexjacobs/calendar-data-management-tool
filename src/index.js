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
var lastUpdate = Firebase.database().ref('lastUpdate');

Firebase.auth().onAuthStateChanged(function (user) {

  if (user) {
    LOGGED_IN = true;
    logout.model.set({
      authorized: true
    });


    events.once('value', (snapshot) => {

      // set integrity signature to avoid database overwrites
      let timeNow = Date.now();
      lastUpdate.set(timeNow);
      sessionStorage.setItem('lastUpdate', timeNow);

      database.reset();
      database.initialLoad = true;
      database.add(snapshot.val());
    });

  } else {
    LOGGED_IN = false;
    database.reset();
    logout.model.set({
      authorized: false
    });
    router.navigate('#/login');
  }
});


router.on('route', function(){
  if (!LOGGED_IN) {
    this.navigate('#/login');
  }
});
