import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import database from './collection-database';
import eventModel from './model-event';

// test: add a new event
// test: change the event timing

database.add({
  text: 'this is a special added event after',
  timing: ['2016-9-18'],
  repeat: 'once'
})


setTimeout(_ => {
  console.log('timout');
  database.at(-2).addNewTiming(['2016-9-15']);
  database.add({
    text: 'after delay test',
    timing: ['2016-09-04'],
    repeat: 'once'
  })
}, 2000)


var test = new eventModel({
  text: 'event model sample text',
  timing: ['2016-09-03'],
  repeat: 'once'
})

database.add(test);
database.at(-1).set('text', 'event model sample text to')

// end tests


/*
 function to return a Backbone Collection that sorts events in date buckets.
 */

export default function dailyViews(start, end) {
  var CURRENT = start;

  // the final Collection that will be returned
  var collectionOfEventsByFullDate = new Backbone.Collection();

  // loop between start and end
  while (end.diff(CURRENT, 'days') >= 0) {

    // to final Collection, add bucket of models that
    // contain their date, and a Collection of events
    // that occur on that date, either due to repetition
    // or a singular event
    collectionOfEventsByFullDate.add({
      events: extractEvents(CURRENT),
      date: moment(CURRENT.clone())
    })
    CURRENT = CURRENT.add(1, 'd');
  }

  return collectionOfEventsByFullDate;
}

function extractEvents(CURRENT) {
  // iterate through entire database
  var result = database.models.filter(x => {

    // if the next model is an annual event
    if (x.get('repeat') === 'annual') {

      // include it if the day and month match
      return _.filter(x.get('timing').models, instance => {
        return _.where(instance, {
          d: +CURRENT.date(),
          m: +CURRENT.month() + 1
        }).length;
      }).length;

      // if the next model is a singular event
    } else if (x.get('repeat') === 'once') {
      // include it if the day/month/year match
      return _.filter(x.get('timing').models, instance => {
        return _.where(instance, {
          d: +CURRENT.date(),
          m: +CURRENT.month() + 1,
          y: +CURRENT.year()
        }).length;
      }).length;

      // if the next model is a month-banner event
    } else if (x.get('repeat') === 'banner') {

      // only include it on the first day of the month
      if (+CURRENT.date() !== 1) return null;

      // and if the current month matches
      return _.filter(x.get('timing').models, instance => {
        return _.where(instance, {
          m: +CURRENT.month() + 1
        }).length;
      }).length;
    } else {
      console.error('something broke!', x);
      return null;
    }
  });
  return result;
}
