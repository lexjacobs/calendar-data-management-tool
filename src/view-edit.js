import Backbone from 'backbone';
import database from './collection-database';

export const EditView = Backbone.View.extend({
  initialize(options) {
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
    console.log(this.$el.find('.editBlock').serializeArray());
  },
  render() {
    this.$el.html(`
    <form class="editBlock">

    <label>event text:<br>
      <textarea name="text" rows="3" cols="80" type="text-box">${this.model.get('text')}</textarea>
    </label><br>

    <label>repeat pattern:<br>
      <select name="repeat">
        <option ${this.model.get('repeat') === 'annual' ? 'selected' : ''} value="annual">annual</option>
        <option ${this.model.get('repeat') === 'variable' ? 'selected' : ''} value="variable">variable</option>
        <option ${this.model.get('repeat') === 'banner' ? 'selected' : ''} value="banner">information about month</option>
      </select>
    </label><br>

    <label>shading:<br>
      <select name="shading">
        <option ${this.model.get('shading') === 'none' ? 'selected' : ''} value="none">none</option>
        <option ${this.model.get('shading') === 'full' ? 'selected' : ''} value="full">full</option>
        <option ${this.model.get('shading') === 'bars' ? 'selected' : ''} value="bars">horizontal bars</option>
        <option ${this.model.get('shading') === 'diagonal' ? 'selected' : ''} value="diagonal">diagonal</option>
      </select>
    </label><br>

    <label>asp:<br>
      <select name="asp">
        <option ${this.model.get('asp') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('asp') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>

    <label>mlh:<br>
      <select name="mlh">
        <option ${this.model.get('mlh') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('mlh') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>

    <label>event starts previous sundown:<br>
      <select name="previousSundown">
        <option ${this.model.get('previousSundown') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('previousSundown') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>

    <label>annual presidential proclamation:<br>
      <select name="proclamation">
        <option ${this.model.get('proclamation') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('proclamation') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>

    <button type='submit' class="btn btn-sm">Update</button>
    </form>
    `);
    return this;
  }
});
