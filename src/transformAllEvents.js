import Backbone from 'backbone';
import database from './collection-database';
import _ from 'underscore';

// convenience developer view for rendering all events to the page
// at unlinked url: /allEvents
const AllEvents = Backbone.View.extend({
  initialize() {
    this.render();

    this.listenTo(database, 'updated', function () {
      this.render();
    }, this);
  },
  findVariable(data) {
    data = _.where(data.toJSON(), {repeat: 'variable'}).map(x => {
      return ` <br>${x.text}`;
    });
    return JSON.stringify(data);
  },
  findAnnual(data) {
    data = _.where(data.toJSON(), {repeat: 'annual'}).map(x => {
      return ` <br>${x.text}`;
    });
    return JSON.stringify(data);
  },
  render() {
    this.$el.html('');
    this.$el.append('<br><br>VARIABLE<br><br>');
    this.$el.append(this.findVariable(database));
    this.$el.append('<br><br>ANNUAL<br><br>');
    this.$el.append(this.findAnnual(database));
    return this;
  }
});

export default AllEvents;
