import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import database from './collection-database';

// the final Collection that will be returned
const collectionOfEventsByFullDate = new Backbone.Collection();

/*
 function to populate a Backbone Collection with events sorted in date buckets.
 */

export default function dailyViews(start, end) {

  collectionOfEventsByFullDate.reset();

  // loop between start and end
  while (end.diff(start, 'days') >= 0) {

    // to final Collection, add bucket of models that
    // contain their date, and a Collection of events
    // that occur on that date, either due to repetition
    // or a singular event
    collectionOfEventsByFullDate.add({
      events: extractEvents(start),
      date: moment(start.clone())
    })
    start = start.add(1, 'd');
  }

  return collectionOfEventsByFullDate;
}

function extractEvents(start) {
  // iterate through entire database
  var result = database.models.filter(x => {

    // if the next model is an annual event
    if (x.get('repeat') === 'annual') {

      // include it if the day and month match
      return _.filter(x.timing.models, instance => {
        return _.where(instance, {
          d: +start.date(),
          m: +start.month() + 1
        }).length;
      }).length;

      // if the next model is a singular event
    } else if (x.get('repeat') === 'variable') {
      // include it if the day/month/year match
      return _.filter(x.timing.models, instance => {
        return _.where(instance, {
          d: +start.date(),
          m: +start.month() + 1,
          y: +start.year()
        }).length;
      }).length;

      // if the next model is a month-banner event
    } else if (x.get('repeat') === 'banner') {

      // only include it on the first day of the month
      if (+start.date() !== 1) return null;

      // and if the current month matches
      return _.filter(x.timing.models, instance => {
        return _.where(instance, {
          m: +start.month() + 1
        }).length;
      }).length;
    } else {
      console.error('something broke!', x);
      return null;
    }
  });
  return result;
}
