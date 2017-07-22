import Backbone from 'backbone';
import moment from 'moment';
import $ from 'jquery';
import database from './collection-database';
import './css-edit.css';

export const EditView = Backbone.View.extend({
  initialize(options) {
    this.collection = database;
    this.options = options;
    this.editBlock = new EditBlock({
      model: this.model,
      variant: this.options.variant
    });
    this.render();
  },
  render() {
    this.$el.html(this.editBlock.el);
  }
});

const EditBlock = Backbone.View.extend({
  initialize(options) {
    this.options = options;
    this.render();
    this.listenTo(this.model, 'change', this.renderClose);
  },
  events: {
    'click button.update-form': 'handleSubmit',
    'change .selectRepeat': 'handleSelectRepeat'
  },
  renderClose() {
    console.log('renderClose');
    this.$el.find('.closeModal').removeClass('hidden');
  },
  handleSubmit(e) {
    e.preventDefault();
    this.composeEventUpdate();
  },
  handleSelectRepeat(e) {
    console.log('select changed', e.target.value);
    this.model.set('repeat', e.target.value, {silent: true});
    this.renderTimingBlocks();
  },
  composeEventUpdate() {
    let timingResult = [];
    $('.timingPill').each((x, y) => timingResult.push($(y).text()));

    let formResult = {};
    this.$el.find('.editBlock').serializeArray().forEach(x => {
      formResult[x.name] = x.value;
    });
    formResult.timing = timingResult;
    console.log('formResult', formResult);
    this.model.set(formResult);
    this.model.mapTimingFromAttributeToCollection();
    console.log('this.model', this.model);
  },
  renderTimingBlocks() {
    this.$el.find('.timing-block-container').html(`
    <label>Dates (click<i class="glyphicon glyphicon-remove"></i> to delete):<br>
      <div class="timingBlocks"></div><br>
    </label><br>
    `);

    this.$el.find('.timingBlocks').html(new TimingBlockContainer({
      model: this.model
    }).el);

  },
  render() {
    let variant = this.options.variant;
    this.$el.html('');
    this.$el.append(`
    <form class="editBlock">

    <label>event text:<br>
      <textarea class="event-text" name="text" rows="3" cols="70" type="text-box">${this.model.get('text')}</textarea>
    </label><br>

    <label>repeat pattern: ${variant === 'add' ? '' : '(delete event and re-create to change)'}<br>
    <select ${variant === 'add' ? '' : 'disabled'} class="form-control selectRepeat" name="repeat">
    <option ${this.model.get('repeat') === 'annual' ? 'selected' : ''} value="annual">annual</option>
    <option ${this.model.get('repeat') === 'variable' ? 'selected' : ''} value="variable">variable</option>
    <option ${this.model.get('repeat') === 'banner' ? 'selected' : ''} value="banner">calendar month heading</option>
    </select>
    </label><br>

    <div class="timing-block-container"></div>

    <label>shading:<br>
      <select class="form-control" name="shading">
        <option ${this.model.get('shading') === 'none' ? 'selected' : ''} value="none">none</option>
        <option ${this.model.get('shading') === 'full' ? 'selected' : ''} value="full">full</option>
        <option ${this.model.get('shading') === 'bars' ? 'selected' : ''} value="bars">horizontal bars</option>
        <option ${this.model.get('shading') === 'diagonal' ? 'selected' : ''} value="diagonal">diagonal</option>
      </select>
    </label><br>

    <label>mlh:<br>
      <select class="form-control" name="mlh">
        <option ${this.model.get('mlh') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('mlh') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>

    <label>asp:<br>
    <select class="form-control" name="asp">
    <option ${this.model.get('asp') === 'no' ? 'selected' : ''} value="no">no</option>
    <option ${this.model.get('asp') === 'yes' ? 'selected' : ''} value="yes">yes</option>
    </select>
    </label><br>

    <label>annual presidential proclamation:<br>
    <select class="form-control" name="proclamation">
    <option ${this.model.get('proclamation') === 'no' ? 'selected' : ''} value="no">no</option>
    <option ${this.model.get('proclamation') === 'yes' ? 'selected' : ''} value="yes">yes</option>
    </select>
    </label><br>

    <label>event starts previous sundown:<br>
      <select class="form-control" name="previousSundown">
        <option ${this.model.get('previousSundown') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('previousSundown') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>
    <br>
    <button type='button' class="btn btn-primary btn-lg update-form">Update</button>

    <button data-dismiss="modal" type='button' class="hidden btn btn-success btn-lg closeModal">Update Successful. Click to close</button>

    </form>
    `);

    this.renderTimingBlocks();
    return this;
  }
});

const TimingBlockContainer = Backbone.View.extend({
  initialize() {
    this.addTimingBlock = new AddTimingBlock({
      model: this.model
    });
    this.listenTo(this.addTimingBlock, 'submitNewDate', this.addNewDate);
    this.render();
  },
  addNewDate() {
    let newDate = $('.date-input-block').serializeArray();
    let result = newDate.map(x => {
      return x.value;
    }).join('-');
    this.$el.prepend(new TimingPill({
      timingString: result
    }).el);
    console.log('result', result);
  },
  tagName: 'span',
  render() {
    this.model.get('timing').forEach(x => {
      this.$el.append(new TimingPill({
        timingString: x
      }).el);
    });
    this.$el.append(this.addTimingBlock.el);
    return this;
  }
});

const AddTimingBlock = Backbone.View.extend({
  initialize() {
    this.render();
  },
  events: {
    submit: 'handleSubmit'
  },
  handleSubmit(e) {
    e.preventDefault();
    this.trigger('submitNewDate');
  },
  render() {
    this.$el.html('<br>Add New Date:');
    this.$el.append('<form class="date-input-block"></form>');

    let year = `<label>Year</label>  <input name="year" type="number" min="1000" max="9999" value=${moment().year()} />`;
    let month = `&nbsp;&nbsp;<label>Month</label>  <input name="month" type="number" min="1" max="12" value="1" />`;
    let day = `&nbsp;&nbsp;<label>Day</label><input name="day" type="number" min="1" max="31" value="1" />`;
    let repeat = this.model.get('repeat');

    if (repeat === 'banner') {
      this.$el.find('.date-input-block').append(month);
    }
    if (repeat === 'annual') {
      this.$el.find('.date-input-block').append(month);
      this.$el.find('.date-input-block').append(day);
    }
    if (repeat === 'variable') {
      this.$el.find('.date-input-block').append(year);
      this.$el.find('.date-input-block').append(month);
      this.$el.find('.date-input-block').append(day);
    }

    this.$el.find('.date-input-block').append(`
      <button class="add-new-date btn btn-sm btn-primary" type="submit">Add</button>
    `);
    return this;
  }
});

const TimingPill = Backbone.View.extend({
  initialize(options) {
    this.options = options;
    this.render();
  },
  events: {
    'click span.timing-pill': 'handleClick'
  },
  handleClick(e) {
    console.log('timing pill handle click', e);
    let remove = this.$el.index();
    $('.timingPill').eq(remove).remove();
  },
  tagName: 'button',
  className: 'btn btn-sm btn-danger timingPill',
  render() {
    this.$el.html(`<span class='timing-pill'>${this.options.timingString}<i class="glyphicon glyphicon-remove"></i></span>`);
    return this;
  }
});
