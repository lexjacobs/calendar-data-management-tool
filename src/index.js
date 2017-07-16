import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';

var start = moment("2016-08-30");
var end = moment("2016-09-03");
var current = start;

var dataset = [
  {
    text:
      "ASSISTANT PRINCIPALS, SCHOOL-BASED INTERMEDIATE SUPERVISORS REPORT, SCHOOL-BASED INTERMEDIATE SUPERVISORS REPORT",
    shading: "bars",
    occurrences: [{ m: 9, d: 1, y: 2016 }, { m: 9, d: 2, y: 2016 }],
    repeat: "irregular"
  },
  {
    text: "Ecclesiastical Year Begins - Greek Orthodox",
    occurrences: [{ m: 9, d: 1 }],
    repeat: "annual"
  }
];

var database = new Backbone.Collection(dataset);

var dailyDatabase = new Backbone.Collection();

while (end.diff(current, "days") >= 0) {
  // console.log(
  //   current.get("year"),
  //   current.get("month") + 1,
  //   current.get("date")
  // );

  var result = database.models.filter(x => {
    if (x.get("repeat") === "annual") {
      return _.filter(x.get("occurrences"), instance => {
        return _.where([instance], {
          d: +current.get("date"),
          m: +current.get("month") + 1
        }).length;
      }).length;
    } else if (x.get("repeat") === "irregular") {
      return _.filter(x.get("occurrences"), instance => {
        return _.where([instance], {
          d: +current.get("date"),
          m: +current.get("month") + 1,
          y: +current.get("year")
        }).length;
      }).length;
    } else {
      console.error("something broke!", x);
    }
  });

  dailyDatabase.add({
    events: result,
    date: moment(current.clone())
  })
  current = current.add(1, "d");
}

console.log(dailyDatabase.models.forEach(x => {
  console.log(x.get('date').calendar());
  x.get('events').forEach(x => {
    console.log(_.values(_.omit(x.attributes, ['occurrences', 'repeat'])));
  })
}))
