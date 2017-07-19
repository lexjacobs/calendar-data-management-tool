import Backbone from 'backbone';
// import _ from 'underscore';
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
  initialize() {

    // map to transform persisted 'timing' array
    // into a Backbone Collection, with
    // mapped date strings => objects, as above
    // NOT saving in attributes, but as a property
    this.timing = new Backbone.Collection(this.get('timing').map(x => timingMapper(x, this.get('repeat'))));
  },

  serializeTiming() {
    this.set('timing', this.timing.toJSON());
  },
  // method for adding string timings after initialization
  addNewTiming(date) {
    this.timing.add(timingMapper(date, this.get('repeat')));

    // changes to collection need to be persisted to model attributes hash
    this.serializeTiming();
    this.trigger('change', this);
  }
});

export function timingMapper(dateString, repetition) {

  // map a month, day, year
  if (repetition === 'variable') {
    let dateObject = moment(dateString, 'YYYY-M-D');
    return {
      m: +dateObject.month() + 1,
      d: +dateObject.date(),
      y: +dateObject.year()
    }
  }

  // don't map a year for annual occurrences
  if (repetition === 'annual') {
    let dateObject = moment(dateString, 'M-D');
    return {
      m: +dateObject.month() + 1,
      d: +dateObject.date()
    }
  }

  // map month only for banner occurrences
  if (repetition === 'banner') {
    let dateObject = moment(dateString, 'M');
    return {
      m: +dateObject.month() + 1
    }
  }
}

export default eventModel;
