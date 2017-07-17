import Backbone from 'backbone';
import applicationRouter from './router';
import 'bootstrap/dist/css/bootstrap.css';

new applicationRouter();
Backbone.history.start();
