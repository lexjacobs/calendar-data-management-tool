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

    this.listenTo(database, 'updated', function () {
      this.redrawSortedViews();
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
    <div class="col-md-2">
    <input class="form-control num-year" placeholder="school calendar year" min="1" type="number" value=${START} /></input>
    </div>
    <button class='btn num-button' type='submit'>submit</button>
    <br><br>
    </form>`
  ),
  render() {
    this.$el.html(this.template());
    return this;
  }
});

const ItemView = Backbone.View.extend({
  initialize(options) {

    this.$el.prepend(`<span class="hidden shading-box">shading: </span>`)

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
    })
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
