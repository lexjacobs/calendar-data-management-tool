import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import dailyViews from './dailyViews'
import './css-sort.css';

export const SortView = Backbone.View.extend({
  initialize() {
    this.render();
  },
  tagName: 'div',
  render() {

    this.$el.append(`Sorted View<br>`)

    var START = moment("2016-08-30");
    var END = moment("2016-09-23");

    var sortedDailyViews = dailyViews(START, END);

    sortedDailyViews.models.forEach(x => {
      this.$el.append(`<br>${x.get('date').calendar()} <br>`);

      this.$el.append(new ItemView({
        collection: new Backbone.Collection(x.get('events'))
      }).el)

      x.get('events').forEach(x => {
        console.log(_.values(_.omit(x.attributes, ['occurrences', 'repeat', 'shading', 'mlh', 'asp'])));
      })
    })

    return this;
  }
});

const ItemView = Backbone.View.extend({
  initialize(options) {

    // check for any instance of shading
    if (options.collection.models.filter(x => {
        return x.get('shading') !== undefined;
      }).length) this.$el.addClass('shading');

    this.render();
  },
  className: 'items',
  tagName: 'div',
  template: _.template('<%= text %><br>'),
  render() {
    this.collection.models.forEach(x => {
      this.$el.append(this.template(x.attributes));
    })
    return this;
  }
});
