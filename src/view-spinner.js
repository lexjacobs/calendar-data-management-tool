import Backbone from 'backbone';
import spinner from './assets/loading.gif';

export const Spinner = Backbone.View.extend({
  initialize() {
    this.render();
  },
  className: 'loading-spinner',
  tagName: 'span',
  render() {
    this.$el.append(`
      <image src=${spinner} />
      `);
  }
});

export default Spinner;
