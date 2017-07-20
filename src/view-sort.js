import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import dailyViews from './dailyViews'
import database from './collection-database';
import './css-sort.css';

var START = moment().year() - 1;

export const SortView = Backbone.View.extend({
  initialize() {
    this.datePicker = new DatePicker();
    this.sortedViews = new SortedViews();
    this.render();

    this.listenTo(this.datePicker, 'dateUpdated', this.redrawSortedViews);

    let lazyRedraw = _.throttle(this.redrawSortedViews, 500, {
      leading: false
    }).bind(this);

    this.listenTo(database, 'updated', function () {
      lazyRedraw();
    }, this)
  },
  render() {
    this.$el.append(this.datePicker.el);
    this.$el.append(this.sortedViews.el);
    return this;
  },
  generateDailyViews(start, end) {
    return dailyViews(moment(start), moment(end));
  },
  redrawSortedViews() {
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
    this.collection && this.collection.models.forEach(x => {

      // on the first of the month, split out banner events and render first
      if (x.get('date').date() === 1) {
        let events = new Backbone.Collection(x.get('events'));

        this.$el.append(`<div style="font-size:20px;">${x.get('date').format('MMMM')} heading:</div>`)
        this.$el.append(new ItemView({
          collection: new Backbone.Collection(events.where({
            repeat: 'banner'
          }))
        }).el);

        this.$el.append(`<br>${x.get('date').format('MMM DD, YYYY ddd')} <br>`);

        this.$el.append(new ItemView({
          collection: new Backbone.Collection(events.reject({
            repeat: 'banner'
          }))
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
    this.model = new Backbone.Model({
      start: `${START}-09-01`,
      end: `${+START+1}-09-01`
    });
    this.render();
  },
  events: {
    'submit': 'setStartEnd',
  },
  setStartEnd(e) {
    let start = $('.num-year').val();
    e.preventDefault();
    this.model.set({
      'start': `${start}-09-01`,
      'end': `${+start+1}-09-01`
    });
    this.trigger('dateUpdated');
  },
  template: _.template(
    `<form>
    <label>Choose the year to display, from September through the following September:</label>
    <br>
    <input class="num-year" placeholder="school calendar year" min="1" type="number" value=${START} /></input>
    <button class='btn num-button' type='submit'>submit</button>
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
    if (this.checkFor('asp', 'true')) this.$el.append(`<span class="asp"></span>`);

    if (this.checkFor('mlh', 'true')) this.$el.append(`<span class="mlh"></span>`);

    if (this.checkFor('previousSundown', 'true')) this.$el.append(`<span class="previous-sundown"></span>`);

    if (this.checkFor('proclamation', 'true')) this.$el.append(`<i class="glyphicon glyphicon-star">`);

    if (this.checkFor('shading', 'full')) this.$el.addClass('shading-full');

    if (this.checkFor('shading', 'diagonal')) this.$el.addClass('shading-diagonal')

    if (this.checkFor('shading', 'bars')) this.$el.addClass('shading-bars');

    this.render();
  },
  checkFor(attr, target) {
    return this.collection.models.filter(x => {
      // works for any shading, but only 'true' for asp/mlh
      return x.get(attr) === target;
    }).length;
  },
  className: 'items',
  tagName: 'div',
  template: _.template(''),
  render() {
    this.collection.models.forEach(x => {
      this.$el.append(`
        <span class="individual-sorted-item">${x.get('text')}</span>
        `);
    })
    return this;
  }
});
