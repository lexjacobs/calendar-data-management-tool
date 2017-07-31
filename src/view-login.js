import Backbone from 'backbone';
import $ from 'jquery';
import { Firebase } from './firebase';
import founder from './assets/founder.png';
import './css-login.css';
import { serializedAttributes } from './shared';

export const Login = Backbone.View.extend({
  initialize() {
    this.render();
  },
  events: {
    'submit .login-form': 'handleSubmit'
  },
  handleSubmit(e) {
    e.preventDefault();

    let loginString = $('form.login-form').serializeArray();

    let email = serializedAttributes(loginString, 'email');
    let password = serializedAttributes(loginString, 'password');

    Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (success) {
        return success;
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

      <div class="container center-container">

        <div class="inner-title">
           Natter's<br>Calendar<br>Management<br>Suite
        </div>

        <div class="inner-upper">
          <form class="login-form">
            <p>Login:</p>
            <label>username<br>
              <input required name="email" type="text" />
            </label><br>
            <label>password<br>
              <input required name="password" type="password" />
            </label><br>
            <button class="login-button" type="submit">Login</button>

          </form>
        </div>

        <div class="inner-lower">
          <img class="founder-image" src=${founder} />
        </div>



      </div>

      `);
  }
});

export default Login;
