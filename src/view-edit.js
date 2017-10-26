import Backbone from 'backbone';
import moment from 'moment';
import {Firebase} from './firebase';
import $ from 'jquery';
import './vendor/modal.js';
import database from './collection-database';
import './css-edit.css';
import { serializedObject } from './shared';

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
  },
  events: {
    'submit .editBlock': 'handleSubmit',
    'change .selectRepeat': 'handleSelectRepeat'
  },
  handleSubmit(e) {
    e.preventDefault();
    this.composeEventUpdate();
  },
  closeModal() {
    $('.modal').modal('hide');
  },
  handleSelectRepeat(e) {
    this.model.set('repeat', e.target.value, {silent: true});
    this.model.set('timing', []);
    this.model.mapTimingFromAttributeToCollection();
    this.renderTimingBlocks();
  },
  lackingAnyDates(arr) {
    return arr.length <= 0;
  },
  composeEventUpdate() {
    let timingResult = [];
    $('.timingPill').each((x, y) => timingResult.push($(y).text()));

    let formResult = serializedObject(this.$el.find('.editBlock').serializeArray());

    // if attempting to submit/edit without at least 1 date
    if(this.lackingAnyDates(timingResult)) {
      $('#editModal').scrollTop(0);
      $('#addModal').scrollTop(0);
      $('.add-new-date-label').addClass('background-red');
      return;
    }
    formResult.timing = timingResult;
    this.model.set(formResult);
    this.model.mapTimingFromAttributeToCollection();

    // add a new event model to database, will ignore existing model
    database.add(this.model);
    database.trigger('update');
    this.closeModal();
  },
  renderTimingBlocks() {
    this.$el.find('.timing-block-container').html(new TimingBlockContainer({
      model: this.model
    }).el);

  },
  render() {

    // good enough for the scope of our project, given only 2 users
    let superuser = Firebase.auth().currentUser.email.includes('x.j');

    let variant = this.options.variant;
    this.$el.html('');
    this.$el.append(`
    <form class="editBlock">

    <label>event text:<br>
      <textarea required placeholder="Enter event text here" class="event-text" name="text" rows="3" cols="70" type="text-box">${this.model.get('text')}</textarea>
    </label><br>

    ${/* NB: changing the repeat pattern will clear out the event array, so a date must be replaced before closing the modal by submitting, or by clicking the close icon */''}

    <label>repeat pattern: ${superuser ? '(enabled for superuser. beware changing this without updating!)' : variant === 'add' ? '' : '(delete event and re-create to change)'}<br>
    <select ${(variant === 'add' || superuser) ? '' : 'disabled'} class="form-control selectRepeat" name="repeat">
    <option ${this.model.get('repeat') === 'annual' ? 'selected' : ''} value="annual">Same Date Annually</option>
    <option ${this.model.get('repeat') === 'variable' ? 'selected' : ''} value="variable">Date Changes Annually</option>
    <option ${this.model.get('repeat') === 'banner' ? 'selected' : ''} value="banner">Calendar Month Box</option>
    </select>
    </label><br>

    <label class="add-new-date-label">Add New Date:<br>
    <div class="timing-block-container"></div><br>
    </label><br>

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

    <label>school day count should be skipped:<br>
      <select class="form-control" name="skipCount">
        <option ${this.model.get('skipCount') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('skipCount') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>

    <label>notes:<br>
      <textarea placeholder="Record helpful notes here, if any" class="event-notes" name="notes" rows="3" cols="70" type="text-box">${this.model.get('notes')}</textarea>
    </label><br>

    <br>
    <button type='submit' class="btn btn-primary btn-lg update-form">${variant === 'add' ? 'Add New Event' : 'Update Event'}</button>

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
  events: {
    'click .timingPill': 'clickedTimingPillToRemove'
  },
  clickedTimingPillToRemove(e) {

    // in case click registers on glyphicon-remove:
    if (!e.target.innerText) {
      e.target = e.target.parentElement;
    }

    let indexToRemove = this.$el.find('.timing-pill-container').find('.timing-pill-wrapper').index(e.target);
    this.model.removeTimingByIndex(indexToRemove);
    this.renderTimingPills();
  },
  addNewDate(newDate) {
    let dateString = newDate.map(x => {
      return x.value;
    }).join('-');
    this.model.addNewTiming(dateString);
    this.renderTimingPills();
    $('.add-new-date-label').removeClass('background-red');
  },
  tagName: 'span',
  renderTimingPills() {
    $('.timing-pill-container').html('');
    this.model.get('timing').forEach(x => {
      this.$el.find('.timing-pill-container').append(new TimingPill({
        timingString: x
      }).el);
    });
  },
  render() {
    this.$el.html('');
    this.$el.append(this.addTimingBlock.el);
    this.$el.append(`<br>Event Dates (click<i class="glyphicon glyphicon-remove"></i> to delete):<br>`);
    this.$el.append('<span class="timing-pill-container"></span>');
    this.renderTimingPills();
    return this;
  }
});

const AddTimingBlock = Backbone.View.extend({
  initialize() {
    this.render();
  },
  events: {
    'submit .date-input-block': 'handleSubmit'
  },
  handleSubmit(e) {
    e.preventDefault();
    let date = this.$el.find('.date-input-block').serializeArray();
    this.trigger('submitNewDate', date);
  },
  render() {
    this.$el.html('');
    this.$el.append('<form class="date-input-block"></form>');

    let year = `<label>Year</label>  <input required name="year" type="number" min="1000" max="9999" value=${moment().year()} />`;
    let month = `&nbsp;&nbsp;<label>Month</label>  <input required name="month" type="number" min="1" max="12" value="1" />`;
    let day = `&nbsp;&nbsp;<label>Day</label><input required name="day" type="number" min="1" max="31" value="1" />`;
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
  tagName: 'span',
  className: 'timingPill',
  render() {
    this.$el.html(`<button type="button" class="btn btn-sm btn-danger timing-pill-wrapper">${this.options.timingString}<i class="glyphicon glyphicon-remove"></i></button>`);
    return this;
  }
});
