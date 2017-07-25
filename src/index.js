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

Firebase.auth().onAuthStateChanged(function (user) {

  if (user) {
    LOGGED_IN = true;
    logout.model.set({
      authorized: true
    });

    var events = Firebase.database().ref('events');
    events.once('value', (snapshot) => {
      database.reset();
      database.add(snapshot.val());
      router.navigate('#/events');
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
