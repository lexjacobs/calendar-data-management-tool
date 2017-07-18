import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import dailyViews from './dailyViews'
import './css-sort.css';

var START = moment().year()-1;

export const SortView = Backbone.View.extend({
  initialize() {
    this.render();
  },
  tagName: 'div',
  render() {
    this.datePicker = new DatePicker();
    this.sortedViews = new SortedViews();
    this.$el.append(this.datePicker.el);
    this.$el.append(this.sortedViews.el);

    this.listenTo(this.datePicker, 'dateUpdated', this.retrigger);

    return this;
  },
  generateDailyViews(start, end) {
    return dailyViews(moment(start), moment(end));
  },
  retrigger() {
    let start = this.datePicker.model.get('start');
    let end = this.datePicker.model.get('end');
    this.sortedViews.collection = this.generateDailyViews(start, end);
    this.sortedViews.trigger('renderAgain');
  }
});

const SortedViews = Backbone.View.extend({
  initialize() {
    this.render();
    this.listenTo(this, 'renderAgain', this.render);
  },
  render() {
    this.$el.html('');
    this.collection &&  this.collection.models.forEach(x => {

      // on the first of the month, split out banner events and render first
      if (x.get('date').date() === 1) {
        let events = new Backbone.Collection(x.get('events'));

        this.$el.append(`<div style="font-size:20px;">${x.get('date').format('MMMM')} heading:</div>`)
        this.$el.append(new ItemView({
          collection: new Backbone.Collection(events.where({repeat: 'banner'}))
        }).el);

        this.$el.append(`<br>${x.get('date').format('MMM DD, YYYY ddd')} <br>`);

        this.$el.append(new ItemView({
          collection: new Backbone.Collection(events.reject({repeat: 'banner'}))
        }).el);

      // on other days just render the events of that day
      } else {

        // append event block date
        this.$el.append(`<br>${x.get('date').format('MMM DD, YYYY ddd')} <br>`);

        this.$el.append(new ItemView({
          collection: new Backbone.Collection(x.get('events'))
        }).el);
      }

      // log all events
      // x.get('events').forEach(x => {
      //   console.log(_.values(_.omit(x.attributes, ['occurrences', 'repeat', 'shading', 'mlh', 'asp'])));
      // })

      return this;
    })
  }
});

const DatePicker = Backbone.View.extend({
  initialize() {
    this.model = new Backbone.Model();
    this.listenTo(this.model, 'change', this.announce);
    this.render();
  },
  announce() {
    this.trigger('dateUpdated');
  },
  events: {
    'submit': "setStartEnd",
  },
  setStartEnd(e) {
    let start = $('.num-year').val();
    e.preventDefault();
    this.model.set({
      'start': `${start}-09-01`,
      'end': `${+start+1}-09-01`
    });
  },
  template: _.template(
    `<form>
    <label>Choose the year to display, from September through the following September:</label>
    <br>
    <input class="num-year" placeholder="school calendar year" min="1" type="number" value=${START} /></input>
    <br>
    <button class='num-button' type='submit'>submit</button>
    </form>`
  ),
  render() {
    this.$el.html(this.template());
    return this;
  }
});

const ItemView = Backbone.View.extend({
  initialize(options) {

    // check for any instance of shading
    if (this.checkFor('shading')) this.$el.addClass('shading');

    if (this.checkFor('asp')) this.$el.append(`<span class="asp"></span>`);

    if (this.checkFor('mlh')) this.$el.append(`<span class="mlh"></span>`);


    this.render();
  },
  checkFor(attr) {
    return this.collection.models.filter(x => {
      return x.get(attr) !== undefined;
    }).length;
  },
  className: 'items',
  tagName: 'div',
  template: _.template('<span class="individual-sorted-item"><%= text %><br></span>'),
  render() {
    this.collection.models.forEach(x => {
      this.$el.append(this.template(x.attributes));
    })
    return this;
  }
});
