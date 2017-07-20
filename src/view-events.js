import Backbone from 'backbone';
import $ from 'jquery';
import { router } from './index';
import './css-events.css';
import database from './collection-database';

export const EventsView = Backbone.View.extend({
  initialize() {
    this.filterChooser = new FilterChooser();
    this.individualEventBlock = new IndividualEventBlock();
    this.render();
    this.listenTo(this.filterChooser, 'filterClicked', this.filterEvents);
  },
  filterEvents(e) {
    this.individualEventBlock.trigger('drawWithFilter', e)
  },
  render() {
    this.$el.html('');
    this.$el.append(this.filterChooser.el);
    this.$el.append(this.individualEventBlock.el);
    return this;
  }
});

const IndividualEventBlock = Backbone.View.extend({
  initialize() {
    this.model = new Backbone.Model({
      filter: {}
    });
    this.collection = database;
    this.listenTo(this.collection, 'updated', this.render);
    this.listenTo(this, 'drawWithFilter', this.drawWithFilter)
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  drawWithFilter(e) {
    if (e === 'all') {
      this.model.set({'filter': {}})
    } else {
      this.model.set({'filter': {repeat: e}});
    }
  },
  render() {
    this.$el.html('');
    this.collection.where(this.model.get('filter')).forEach(function(x) {
      this.$el.append(new IndividualEvent({
        model: x
      }).el);
    }, this);
    return this;
  }
})

const IndividualEvent = Backbone.View.extend({
  initialize() {
    this.render();
    this.collection = database;
  },
  className: 'individual-event-block',
  events: {
    'click .editButton': 'openEditRoute',
    'click .deleteButton': 'deleteRecord'
  },
  deleteRecord() {
    if (window.confirm(`confirm deletion of ${this.model.get('text')}`)) {
      console.log('I would delete this record');
    } else {
      console.log('I would not delete this record');
    }
  },
  openEditRoute() {
    router.navigate(`#/edit/${this.model.cid}`);
  },
  render() {
    this.$el.html(`<span class="editButton event-button">
      <button class='btn btn-sm'>edit</button>
    </span>
    <span class="deleteButton event-button">
    <button class='btn btn-danger btn-sm'>delete</button>
    </span><br>
    text: ${this.model.get('text')}<br>
    timing: ${this.model.get('timing')}<br>
    repeat: ${this.model.get('repeat')}<br>
    mlh: ${this.model.get('mlh')}<br>
    asp: ${this.model.get('asp')}<br>
    shading: ${this.model.get('shading')}<br>
    `);
    // this.$el.append(this.editBlock.el);
    return this;
  }
})

const FilterChooser = Backbone.View.extend({
  initialize() {
    this.render();
  },
  className: 'filter-chooser well',
  events: {
    click: 'clickHandler'
  },
  clickHandler(e) {
    let clickTarget = $(e.target).data('repeat');
    this.trigger('filterClicked', clickTarget);
  },
  render() {
    this.$el.html(`Filter by: <span data-repeat="annual">Annual events</span> | <span data-repeat="variable">Changing Events</span> | <span data-repeat="banner">Month headings</span> | <span data-repeat="all">none</span>`);
    return this;
  }
});
