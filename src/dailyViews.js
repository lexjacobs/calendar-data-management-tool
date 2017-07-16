import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import database from './database';

export default function dailyViews(start, end) {
  var CURRENT = start;
  var collectionOfEventsByFullDate = new Backbone.Collection();

  while (end.diff(CURRENT, 'days') >= 0) {

    var result = database.models.filter(x => {
      if (x.get('repeat') === 'annual') {
        return _.filter(x.get('timing'), instance => {
          return _.where([instance], {
            d: +CURRENT.date(),
            m: +CURRENT.month() + 1
          }).length;
        }).length;
      } else if (x.get('repeat') === 'once') {
        return _.filter(x.get('timing'), instance => {
          return _.where([instance], {
            d: +CURRENT.date(),
            m: +CURRENT.month() + 1,
            y: +CURRENT.year()
          }).length;
        }).length;
      } else if (x.get('repeat') === 'banner') {

        if (+CURRENT.date() !== 1) return null;

        return _.filter(x.get('timing'), instance => {
          return _.where([instance], {
            m: +CURRENT.month() + 1
          }).length;
        }).length;
      } else {
        console.error('something broke!', x);
      }
    });

    collectionOfEventsByFullDate.add({
      events: result,
      date: moment(CURRENT.clone())
    })
    CURRENT = CURRENT.add(1, 'd');
  }

  return collectionOfEventsByFullDate;

}
