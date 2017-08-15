import Backbone from 'backbone';
// import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
// import dailyViews from './dailyViews';
import database from './collection-database';
import './css-alternate.css';
import ordinal from 'ordinal';
// import { serializedObject } from './shared.js';
// import repeat from './assets/svg/repeat.svg';
import { SortView, DatePicker } from './view-sort';

export const AlternateView = SortView.extend({
  initialize() {
    this.datePicker = new DatePicker();
    this.sortedViews = new SortedViews({
      model: this.datePicker.model
    });
    this.render();

    this.listenTo(this.datePicker.model, 'change', this.redrawSortedViews);

    this.listenTo(database, 'updated', function () {
      this.redrawSortedViews();
    }, this);
  },
});

// export const AlternateView = Backbone.View.extend({
//   initialize() {
//     this.datePicker = new DatePicker();
//     this.sortedViews = new SortedViews({
//       model: this.datePicker.model
//     });
//     this.render();
//
//     this.listenTo(this.datePicker.model, 'change', this.redrawSortedViews);
//
//     this.listenTo(database, 'updated', function () {
//       this.redrawSortedViews();
//     }, this);
//   },
//   render() {
//     this.$el.append(this.datePicker.el);
//     this.$el.append(this.sortedViews.el);
//     return this;
//   },
//   generateDailyViews(start, end) {
//     if(!start) return null;
//     return dailyViews(moment(start), moment(end));
//   },
//   redrawSortedViews() {
//     let start = this.datePicker.model.get('sortStart');
//     let end = this.datePicker.model.get('sortFinish');
//     this.sortedViews.collection = this.generateDailyViews(start, end);
//     this.sortedViews.render();
//   }
// });

const SortedViews = Backbone.View.extend({
  initialize() {
    this.resetCounterVariables();
    this.render();
  },
  resetCounterVariables() {
    this.COUNT = 0;
    this.COUNT_WEEK = 0;
    this.WEEK_APPENDED_YET = false;
    this.EVENT_COUNT_GLOBAL = 0;
  },
  resetWeekCounter() {
    this.WEEK_APPENDED_YET = false;
  },
  addEventDate(model) {
    return `<br><br>${++this.EVENT_COUNT_GLOBAL}|A|1|${model.get('date').format('MM/DD/YYYY')}|`;
  },
  // addBannerHeading(model) {
  //   return `<div style="font-size:20px;">${model.get('date').format('MMMM')} ${model.get('date').format('YYYY')} month box:</div>`;
  // },
  countWeek() {
    if(this.WEEK_APPENDED_YET) return '';
    this.WEEK_APPENDED_YET = true;
    return `<span>${ordinal(++this.COUNT_WEEK)} week^</span>`;
  },
  addCount(dayBlock) {

    /*
      this.model provides access to the following:
        schoolDaysCount: "100"
        schoolStartDay: "1"
        schoolStartMonth: "9"
        schoolStartYear: "2017"
        sortFinish: "2018-09-30"
        sortStart: "2017-09-01"
     */

    // only start counting on the first day of school
    let schoolStart = moment(`${this.model.get('schoolStartYear')} ${this.model.get('schoolStartMonth')} ${this.model.get('schoolStartDay')}`, 'YYYY M D');
    if (dayBlock.get('date').diff(schoolStart) < 0) return null;

    // don't count on weekends,
    // but reset WEEK_APPENDED_YET over the weekend
    let day = dayBlock.get('date').day();
    if (day === 0 || day === 6) {
      this.resetWeekCounter();
      return null;
    }

    // don't count when there are events that specify skipping
    if (_.any(dayBlock.get('events'), x => {
      return x.get('skipCount') === 'yes';
    })) return null;

    // increment global count, but
    // don't count after the last day of school
    if (++this.COUNT > this.model.get('schoolDaysCount')) return null;

    // otherwise, count DAY and WEEK
    return `${this.countWeek()}<span>Day ${this.COUNT}/${this.model.get('schoolDaysCount') - this.COUNT + 1}</span>`;

  },
  className: 'alternate-view-box',
  render() {
    this.resetCounterVariables();
    this.$el.html('');

    // formatting instructions
    this.collection && this.$el.append(`ÔªøID|Status|Version|Date|Event Details(# means notes and ^ means other event entry)`);

    this.collection && this.collection.models.forEach(x => {

      let count = this.addCount(x);

      // ignore dates without events unless there is a need to count day / week
      if (x.get('events').length === 0 && count === null) {
        return this;
      }

      // append event block date
      this.$el.append(this.addEventDate(x));

      // render school day count up/down
      this.$el.append(count);

      // add divider if count + events
      if (count !== null && x.get('events').length) {
        this.$el.append('^');
      }

      // render events
      this.$el.append(new ItemView({
        collection: new Backbone.Collection(x.get('events'))
      }).el);

      return this;
    });
  }
});

// const DatePicker = Backbone.View.extend({
//   initialize() {
//     this.start = moment().year();
//     this.model = new Backbone.Model();
//     this.render();
//   },
//   events: {
//     'submit': 'setYearParameters',
//   },
//   setYearParameters(e) {
//     e.preventDefault();
//
//     let values = serializedObject($('.schoolYearChooser').serializeArray());
//     let start = values.start;
//     this.model.set({
//       'sortStart': `${start}-09-01`,
//       'sortFinish': `${+start+1}-09-30`,
//       'schoolStartYear': start,
//       'schoolStartMonth': values.month,
//       'schoolStartDay': values.day,
//       'schoolDaysCount': values.count,
//     });
//   },
//   render() {
//     this.$el.html(`<form class="schoolYearChooser">
//     <label>Choose the year to display, from September through the following September:<br>
//       <div class="col-md-4">
//         <input required name="start" placeholder="school calendar year" min="999" max="9999" type="number" value=${this.start} />
//       </div>
//     </label><br>
//
//     <label>Choose when to start counting school days:</label><br>
//
//     <label>Month</label>
//     <input required name="month" type="number" min="1" max="12" value="9" />
//     &nbsp;&nbsp;
//     <label>Day</label><input required name="day" type="number" min="1" max="31" value="" /></label>
//     <br>
//     <label>Number of school days
//     <input required type="number" min="1" value="" name="count"></label><br>
//
//     <button class='btn num-button' type='submit'>draw sorted list</button>
//     <br><br>
//     </form>`);
//     return this;
//   }
// });

const ItemView = Backbone.View.extend({
  initialize() {

    // this.$el.prepend(`<span class="hidden shading-box">shading: </span>`);

    // check for any instance of shading
    if (this.checkFor('asp', 'yes')) this.$el.append(`ASP Off^`);

    if (this.checkFor('mlh', 'yes')) this.$el.append(`MLH Rules On^`);

    // if (this.checkFor('shading', 'full')) this.$el.find('.shading-box').removeClass('hidden').append('full ');
    //
    // if (this.checkFor('shading', 'diagonal')) this.$el.find('.shading-box').removeClass('hidden').append('diagonal ');
    //
    // if (this.checkFor('shading', 'bars')) this.$el.find('.shading-box').removeClass('hidden').append('bars ');

    this.render();
  },
  checkFor(attr, target) {
    return this.collection.models.filter(x => {
      return x.get(attr) === target;
    }).length;
  },
  // className: 'items',
  tagName: 'span',
  render() {

    // only prepend the ^ between successive items
    let divideItems = _.after(2, () => {
      this.$el.append('^');
    });

    this.collection.models.forEach(x => {
      divideItems();
      this.$el.append(new IndividualItem({
        model: x
      }).el);
    });
    return this;
  }
});

const IndividualItem = Backbone.View.extend({
  initialize() {
    if (this.checkFor('proclamation', 'yes')) {
      this.$el.append(`★`);
    }
    if (this.checkFor('previousSundown', 'yes')) this.$el.append(`●`);
    this.render();
  },
  checkFor(attr, target) {
    return this.model.get(attr) === target;
  },
  tagName: 'span',
  // className: 'individual-sorted-item',
  render() {
    this.$el.append(`${this.model.get('text')}`);

    // add icon for repeating event
    // if (this.model.get('repeat') === 'annual') {
    //   this.$el.prepend(`<img class='individual-item-svg' src=${repeat}>`);
    // }

    // add icon for individual event
    // if (this.model.get('repeat') === 'variable') {
    //   this.$el.prepend(`<span class="badge individual-item-badge">1</span>`);
    // }

    return this;
  }
});
