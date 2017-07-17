import Backbone from 'backbone';
import dataset from './dataset';
import eventModel from './model-event';

const Database = Backbone.Collection.extend({
  model: eventModel
});

const database = new Database();
database.add(dataset);


// test: add a new event
database.add({
  text: 'this is a special added event after',
  timing: ['2016-9-18'],
  repeat: 'once'
})

// test: change the event timing
var e = database.where({'text': 'this is a special added event after'})[0];
e.set({'timing': e.get('timing').concat({y:2016, d:18, m:9})})

export default database;
