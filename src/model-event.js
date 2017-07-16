import Backbone from 'backbone';
import moment from 'moment';
window.moment = moment;

/*
maps from timing: ['2016-9-1','2016-9-2'] ==>
timing: [{ m: 9, d: 1, y: 2016 }, { m: 9, d: 2, y: 2016 }]

-or

['9-1'] ==>
timing: [{ m: 9, d: 1 }]

-or

['9'] ==>
timing: [{ m: 9 }]

 */

const eventModel = Backbone.Model.extend({
  initialize(){

    let mappedTiming = this.get('timing').map(x => {
      let repetition = this.get('repeat');

      // map a month, day, year
      if (repetition === 'once') {
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

      // map month only for banner occurrences
      if (repetition === 'banner') {
        let dateObject = moment(x, 'M');
        return {
          m: +dateObject.month() + 1
        }
      }

    })

    this.set('timing', mappedTiming);
  }
});

export default eventModel;
