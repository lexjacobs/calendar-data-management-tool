import 'bootstrap/dist/css/bootstrap.css';
import Backbone from 'backbone';
import applicationRouter from './router';

new applicationRouter();
Backbone.history.start();
