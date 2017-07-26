import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import dailyViews from './dailyViews';
import database from './collection-database';
import './css-sort.css';
import { serializedObject } from './shared.js';

export const SortView = Backbone.View.extend({
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
  render() {
    this.$el.append(this.datePicker.el);
    this.$el.append(this.sortedViews.el);
    return this;
  },
  generateDailyViews(start, end) {
    if(!start) return null;
    return dailyViews(moment(start), moment(end));
  },
  redrawSortedViews() {
    let start = this.datePicker.model.get('sortStart');
    let end = this.datePicker.model.get('sortFinish');
    this.sortedViews.collection = this.generateDailyViews(start, end);
    this.sortedViews.render();
  }
});

const SortedViews = Backbone.View.extend({
  initialize() {
    this.resetCounterVariables();
    this.render();
  },
  resetCounterVariables() {
    this.COUNT = 0;
    this.COUNT_WEEK = 0;
    this.WEEK_APPENDED_YET = false;
  },
  resetWeekCounter() {
    this.WEEK_APPENDED_YET = false;
  },
  addEventDate(model) {
    return `<br>${model.get('date').format('MMM DD, YYYY ddd')}<br>`;
  },
  addBannerHeading(model) {
    return `<div style="font-size:20px;">${model.get('date').format('MMMM')} ${model.get('date').format('YYYY')} heading:</div>`;
  },
  countWeek() {
    if(this.WEEK_APPENDED_YET) return '';
    this.WEEK_APPENDED_YET = true;
    return `<div class="week-count">WEEK: ${++this.COUNT_WEEK}</div>`;
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

    // otherwise, count
    return `${this.countWeek()} <div class="day-count">DAY: ${this.COUNT} | ${this.model.get('schoolDaysCount') - this.COUNT + 1}</div>`;

  },
  render() {
    this.resetCounterVariables();
    this.$el.html('');
    this.collection && this.collection.models.forEach(x => {

      // on the first of the month, split out banner events and render first
      if (x.get('date').date() === 1) {

        // render banner heading
        this.$el.append(this.addBannerHeading(x));

        let events = new Backbone.Collection(x.get('events'));

        // render banner events
        this.$el.append(new ItemView({
          collection: new Backbone.Collection(events.where({
            repeat: 'banner'
          }))
        }).el);

        // append event block date
        this.$el.append(this.addEventDate(x));

        // render school day count up/down
        this.$el.append(this.addCount(x));

        // render events
        this.$el.append(new ItemView({
          collection: new Backbone.Collection(events.reject({
            repeat: 'banner'
          }))
        }).el);

        // on other days just render the events of that day
      } else {

        // append event block date
        this.$el.append(this.addEventDate(x));

        // render school day count up/down
        this.$el.append(this.addCount(x));

        // render events
        this.$el.append(new ItemView({
          collection: new Backbone.Collection(x.get('events'))
        }).el);
      }

      return this;
    });
  }
});

const DatePicker = Backbone.View.extend({
  initialize() {
    this.start = moment().year();
    this.model = new Backbone.Model();
    this.render();
  },
  events: {
    'submit': 'setYearParameters',
  },
  setYearParameters(e) {
    e.preventDefault();

    let values = serializedObject($('.schoolYearChooser').serializeArray());
    console.log('captured values', values);
    let start = values.start;
    this.model.set({
      'sortStart': `${start}-09-01`,
      'sortFinish': `${+start+1}-09-30`,
      'schoolStartYear': start,
      'schoolStartMonth': values.month,
      'schoolStartDay': values.day,
      'schoolDaysCount': values.count,
    });
    console.log('model is now', this.model.attributes);
  },
  render() {
    this.$el.html(`<form class="schoolYearChooser">
    <label>Choose the year to display, from September through the following September:<br>
      <div class="col-md-4">
        <input required name="start" placeholder="school calendar year" min="999" max="9999" type="number" value=${this.start} />
      </div>
    </label><br>

    <label>Choose when to start counting school days:</label><br>

    <label>Month</label>
    <input required name="month" type="number" min="1" max="12" value="9" />
    &nbsp;&nbsp;
    <label>Day</label><input required name="day" type="number" min="1" max="31" value="1" /></label>
    <br>
    <label>Number of school days
    <input required type="number" min="1" value="100" name="count"></label><br>

    <button class='btn num-button' type='submit'>draw sorted list</button>
    <br><br>
    </form>`);
    return this;
  }
});

const ItemView = Backbone.View.extend({
  initialize() {

    this.$el.prepend(`<span class="hidden shading-box">shading: </span>`);

    // check for any instance of shading
    if (this.checkFor('asp', 'yes')) this.$el.append(`<div class="asp"></div>`);

    if (this.checkFor('mlh', 'yes')) this.$el.append(`<div class="mlh"></div>`);

    if (this.checkFor('shading', 'full')) this.$el.find('.shading-box').removeClass('hidden').append('full ');

    if (this.checkFor('shading', 'diagonal')) this.$el.find('.shading-box').removeClass('hidden').append('diagonal ');

    if (this.checkFor('shading', 'bars')) this.$el.find('.shading-box').removeClass('hidden').append('bars ');

    this.render();
  },
  checkFor(attr, target) {
    return this.collection.models.filter(x => {
      return x.get(attr) === target;
    }).length;
  },
  className: 'items',
  tagName: 'div',
  render() {
    this.collection.models.forEach(x => {
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
      this.$el.append(`<i class="glyphicon glyphicon-star">`);
    }
    if (this.checkFor('previousSundown', 'yes')) this.$el.append(`<span class="previous-sundown"></span><span class="sundown-spacer"></span>`);
    this.render();
  },
  checkFor(attr, target) {
    return this.model.get(attr) === target;
  },
  className: 'individual-sorted-item',
  render() {
    this.$el.append(`${this.model.get('text')}`);
    return this;
  }
});
