import Backbone from 'backbone';
import dataset from './dataset';
import eventModel from './model-event';

const Database = Backbone.Collection.extend({
  initialize() {
    this.listenTo(this, 'change', function(x){
      this.answer('database change', x);
    }, this);
    this.listenTo(this, 'add', function(x){
      this.answer('database add', x);
    }, this);
    this.listenTo(this, 'update', function(x){
      this.answer('database update', x);
    }, this);

  },
  answer(event, cb) {
    console.log('heard', this);
  },
  model: eventModel
});

const database = new Database();
database.add(dataset);

export default database;
