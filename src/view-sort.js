import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import dailyViews from './dailyViews'

export const SortView = Backbone.View.extend({
  initialize() {
    this.render();
  },
  render() {

    this.$el.append(`Sorted View<br>`)

    var START = moment("2016-08-30");
    var END = moment("2016-09-23");

    dailyViews(START, END).models.forEach(x => {
      this.$el.append(`${x.get('date').calendar()} <br>`);
      x.get('events').forEach(x => {
        this.$el.append(`${_.values(_.omit(x.attributes, ['occurrences', 'repeat', 'shading', 'mlh', 'asp']))}<br>`);
      })
    })

    return this;
  }
});
