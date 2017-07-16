import Backbone from 'backbone';
import dataset from './dataset';
import eventModel from './model-event';

const Database = Backbone.Collection.extend({
  model: eventModel
});

const database = new Database();

database.add(dataset);
export default database;
