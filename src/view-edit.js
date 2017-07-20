import Backbone from 'backbone';
import database from './collection-database';

export const EditView = Backbone.View.extend({
  initialize(options) {
    console.log('options: ', options)
    this.collection = database;
    this.options = options;
    this.editBlock = new EditBlock({
      model: this.collection.get(options.routeParameters[0])
    });
    this.render();
  },
  render() {
    this.$el.html(this.editBlock.el);
  }
})

const EditBlock = Backbone.View.extend({
  initialize() {
    console.log('edit block model?', this.model);
    this.render();
  },
  events: {
    'submit': 'handleSubmit'
  },
  handleSubmit(e) {
    e.preventDefault();
    console.log(this.$el.find('.editBlock').serialize());
  },
  className: 'hidden',
  render() {
    this.$el.html(`
    <form class="editBlock">
    <label>event text:
      <textarea name="text" rows="3" cols="80" type="text-box">${this.model.get('text')}</textarea>
    </label><br>
    <label>repeat:
      <select value="annual" name="repeat">
        <option value="annual">annual</option>
        <option value="variable">variable</option>
        <option value="banner">month info block</option>
      </select>
    </label><br>
    <label>shading:
      <select value="none" name="shading">
        <option value="none">none</option>
        <option value="full">full</option>
        <option value="bars">horizontal bars</option>
        <option value="diagonal">diagonal</option>
      </select>
    </label>
    // TODO: MAke this "true" or "false" as string
    <label>check for "asp:off"
      <input name="asp" type="checkbox" value="true" />
    </label>
    <button type='submit' class="btn btn-sm">Update</button>
    </form>
    `);
    return this;
  }
});
