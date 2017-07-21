import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import { router } from './index';
import './css-events.css';
import database from './collection-database';

export const EventsView = Backbone.View.extend({
  initialize() {
    this.filterChooser = new FilterChooser();
    this.individualEventBlock = new IndividualEventBlock({model: this.filterChooser.model});
    this.render();
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
    this.collection = database;
    this.listenTo(this.collection, 'updated', this.render);
    this.listenTo(this.model, 'change', this.render);
    this.render();
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
});

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
      console.log(`Deleting ${this.model.get('text')}`);
      database.remove(this.model.cid);
    } else {
      console.log(`Not deleting ${this.model.get('text')}`);
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
    repeat: ${this.model.get('repeat')}<br>

    ${this.model.get('repeat') === 'banner' ? 'calendar month box' : 'date(s)'}: ${this.model.get('timing').join(' / ')}<br>

    shading: ${this.model.get('shading')}<br>
    mlh: ${this.model.get('mlh')}<br>
    asp: ${this.model.get('asp')}<br>
    presidential proclamation: ${this.model.get('proclamation')}<br>
    starts previous sundown: ${this.model.get('previousSundown')}<br>
    `);
    return this;
  }
});

const FilterChooser = Backbone.View.extend({
  initialize() {
    this.model = new Backbone.Model({
      filter: {}
    });
    this.render();
  },
  className: 'filter-chooser well',
  events: {
    click: 'clickHandler'
  },
  clickHandler(e) {
    let clickTarget = $(e.target).data('repeat');
    if (clickTarget === undefined) return null;
    if (clickTarget === 'all') {
      this.model.set({'filter': {}});
    } else {
      this.model.set({'filter': {repeat: clickTarget}});
    }
    this.render();
  },
  template: _.template(`Filter by:
  <span class="<% if(this.model.get('filter').repeat === 'annual')print('active') %>" data-repeat="annual">
  Annual events</span> |
  <span class="<% if(this.model.get('filter').repeat === 'variable')print('active') %>" data-repeat="variable">
  Changing Events</span> |
  <span class="<% if(this.model.get('filter').repeat === 'banner')print('active') %>" data-repeat="banner">Month headings</span> |
  <span class="<% if(this.model.get('filter').repeat === undefined)print('active') %>" data-repeat="all">All Events</span>`
),
  render() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});
