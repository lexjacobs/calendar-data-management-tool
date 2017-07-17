import Backbone from 'backbone';

export const EventsView = Backbone.View.extend({
  initialize() {
    this.render();
  },
  render() {
    this.$el.html('hello from events view');
    return this;
  }
});
