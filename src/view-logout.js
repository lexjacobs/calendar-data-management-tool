import Backbone from 'backbone';
import { Firebase } from './firebase';

export const Logout = Backbone.View.extend({
  initialize() {
    this.model = new Backbone.Model({
      authorized: false
    });
    this.render();
    this.listenTo(this.model, 'change', this.render);
  },
  events: {
    'click': 'handleClick'
  },
  handleClick() {

    if (this.model.get('authorized')) {
      Firebase.auth().signOut().then(function() {
        console.log('logout successful');
      }).catch(function(error) {
        console.log('view-logout log out error', error);
      });
    }
  },
  el: 'li',
  render() {
    console.log('checking authorization', this.model.get('authorized'));

    if (this.model.get('authorized')) {
      this.$el.html(`<a class="nav-link">Log out</a>`);
    } else {
      this.$el.html(`<a class="nav-link" href="#/login">Log in</a>`);
    }
    return this;
  }
});

export default Logout;
