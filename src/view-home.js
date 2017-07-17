import Backbone from 'backbone';

export const HomeView = Backbone.View.extend({
  initialize() {
    this.render();
  },
  render() {
    this.$el.html('hello from home view');
    return this;
  }
});

export const EventsView = Backbone.View.extend({
  initialize() {
    this.render();
  },
  render() {
    this.$el.html('hello from events view');
    return this;
  }
});
