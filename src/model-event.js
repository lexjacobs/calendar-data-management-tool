import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';

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

export const EventModel = Backbone.Model.extend({
  initialize() {
    this.mapTimingFromAttributeToCollection();
  },
  mapTimingFromAttributeToCollection() {

    // map to transform model attribute 'timing' array
    // into a Backbone Collection, with
    // mapped [date strings] => objects, as above in comment
    // NOT saving as a model attribute, but as a property on the object
    this.timing = new Backbone.Collection(this.get('timing').map(x => this.timingMapper(x, this.get('repeat'))));
  },
  defaults: {
    text: '',
    timing: [],
    repeat: 'variable',
    shading: 'none',
    mlh: 'no',
    asp: 'no',
    proclamation: 'no',
    previousSundown: 'no',
    skipCount: 'no',
    notes: ''
  },
  addNewTiming(date) {
    // method for adding string timings after initialization
    this.timing.add(this.timingMapper(date, this.get('repeat')));

    // changes to collection need to be persisted to model attributes hash
    this.set('timing', this.serializeTiming(this.timing.models, this.get('repeat')));
    this.trigger('change', this);
  },
  removeTiming(dateString) {
    // method for removing string timings after initialization
    let timingObject = this.timingMapper(dateString, this.get('repeat'));
    let removalObject = _.first(this.timing.where(timingObject));

    // persist changes to collection to model attributes hash
    removalObject &&  this.timing.remove(removalObject.cid);
    this.set('timing', this.serializeTiming(this.timing.models, this.get('repeat')));
    this.trigger('change', this);
  },

  // triggered by view-edit.js
  removeTimingByIndex(index) {

    // don't remove nonexistent models
    this.timing.at(index) && this.timing.remove(this.timing.at(index).cid);
    this.set('timing', this.serializeTiming(this.timing.models, this.get('repeat')));
  },
});

EventModel.prototype.timingMapper = timingMapper;
EventModel.prototype.serializeTiming = serializeTiming;

// convert from model such as {y:2016, m:3, d:2} => ['2016-3-2']
export function serializeTiming(model, repeat) {
  if (repeat === 'annual') {
    return model.map(x => {
      return [x.get('m'), x.get('d')].join('-');
    });
  } else if (repeat === 'variable') {
    return model.map(x => {
      return [x.get('y'), x.get('m'), x.get('d')].join('-');
    });
  } else if (repeat === 'banner') {
    return model.map(x => {
      return `${x.get('m')}`;
    });
  } else {
    console.error('serializeTiming fell through');
    return null;
  }
}

// convert from array such as ['3-2'] => {m:3, d:2}
export function timingMapper(dateString, repeat) {

  // map a month, day, year
  if (repeat === 'variable') {
    let dateObject = moment(dateString, 'YYYY-M-D');
    return {
      m: +dateObject.month() + 1,
      d: +dateObject.date(),
      y: +dateObject.year()
    };
  }

  // don't map a year for annual occurrences
  if (repeat === 'annual') {
    let dateObject = moment(dateString, 'M-D');
    return {
      m: +dateObject.month() + 1,
      d: +dateObject.date()
    };
  }

  // map month only for banner occurrences
  if (repeat === 'banner') {
    let dateObject = moment(dateString, 'M');
    return {
      m: +dateObject.month() + 1
    };
  }
}

export default EventModel;
