import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import database from './database';

export default function dailyViews(start, end){
  var CURRENT = start;
  var dailyDatabase = new Backbone.Collection();

  while (end.diff(CURRENT, "days") >= 0) {

    var result = database.models.filter(x => {
      if (x.get("repeat") === "annual") {
        return _.filter(x.get("occurrences"), instance => {
          return _.where([instance], {
            d: +CURRENT.get("date"),
            m: +CURRENT.get("month") + 1
          }).length;
        }).length;
      } else if (x.get("repeat") === "irregular") {
        return _.filter(x.get("occurrences"), instance => {
          return _.where([instance], {
            d: +CURRENT.get("date"),
            m: +CURRENT.get("month") + 1,
            y: +CURRENT.get("year")
          }).length;
        }).length;
      } else {
        console.error("something broke!", x);
      }
    });

    dailyDatabase.add({
      events: result,
      date: moment(CURRENT.clone())
    })
    CURRENT = CURRENT.add(1, "d");
  }

  return dailyDatabase;

}
