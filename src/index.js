import moment from 'moment';
import _ from 'underscore';
import dailyViews from './dailyViews'

var START = moment("2016-07-30");
var END = moment("2016-09-03");



console.log(dailyViews(START, END).models.forEach(x => {
  console.log(x.get('date').calendar());
  x.get('events').forEach(x => {
    console.log(_.values(_.omit(x.attributes, ['occurrences', 'repeat'])));
  })
}))
