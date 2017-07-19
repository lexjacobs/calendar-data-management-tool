import Backbone from 'backbone';
// import $ from 'jquery';
// import _ from 'underscore';
// import moment from 'moment';
import './css-sort.css';
import database from './collection-database';

export const EventsView = Backbone.View.extend({
  initialize() {
    this.collection = database;
    this.listenTo(this.collection, 'update', this.render);
    this.render();
  },
  render() {
    this.$el.html('');
    this.$el.append(new IndividualEventBlock().el);
    return this;
  }
});

const IndividualEventBlock = Backbone.View.extend({
  initialize() {
    this.collection = database;
    this.render();
  },
  render() {
    this.$el.html('');
    this.collection.models.forEach(function(x) {
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
  },
  events: {click: 'answer'},
  answer(e) {
    console.log('heard it', e.target);
    console.log(this.model.attributes);
  },
  render() {
    this.$el.html(`${this.model.get('text')}<br>`);
    return this;
  }
})
