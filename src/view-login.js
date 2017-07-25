import Backbone from 'backbone';
import $ from 'jquery';
import { Firebase } from './firebase';

export const Login = Backbone.View.extend({
  initialize() {
    this.render();
  },
  events: {
    'click .login-button': 'handleSubmit'
  },
  handleSubmit(e) {
    e.preventDefault();

    let loginString = $('form.login-form').serializeArray().map(item => item.value);

    let email = loginString[0];
    let password = loginString[1];

    Firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (success) {
      console.log(success);
    })
    .catch(function (error) {
      console.error('auth error');
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

  },
  render() {
    this.$el.html(`

      <div class="container login-container">
      <form class="login-form">

        <label>username<br>
          <input required name="username" type="text" />
        </label><br>
        <label>password<br>
          <input required name="password" type="password" />
        </label><br>
        <button class="login-button" type="button">Login</button>

      </form>
      </div>

      `);
  }
});

export default Login;
