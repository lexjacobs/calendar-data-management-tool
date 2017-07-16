import Backbone from 'backbone';
import moment from 'moment';
window.moment = moment;

/*
maps from occurrences: ['2016-9-1','2016-9-2'] ==>
occurrences: [{ m: 9, d: 1, y: 2016 }, { m: 9, d: 2, y: 2016 }]

-or

['9-1'] ==>
occurrences: [{ m: 9, d: 1 }]

 */

const eventModel = Backbone.Model.extend({
  initialize(){

    let mappedOccurrences = this.get('occurrences').map(x => {
      let repetition = this.get('repeat');

      // map a month, day, year
      if (repetition === 'irregular') {
        let dateObject = moment(x, 'YYYY-M-D');
        return {
          m: +dateObject.month() + 1,
          d: +dateObject.date(),
          y: +dateObject.year()
        }
      }

      // don't map a year for annual occurrences
      if (repetition === 'annual') {
        let dateObject = moment(x, 'M-D');
        return {
          m: +dateObject.month() + 1,
          d: +dateObject.date()
        }
      }

    })

    this.set('occurrences', mappedOccurrences);
  }
});

export default eventModel;
