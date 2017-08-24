import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import './css-events.css';
import database from './collection-database';
import EditModal from './view-editModal';
import AddModal from './view-addModal';
import spinner from './view-spinner';

export const EventsView = Backbone.View.extend({
  initialize() {
    this.collection = database;
    this.filterChooser = new FilterChooser();
    this.individualEventBlock = new IndividualEventBlock({
      model: this.filterChooser.model,
      collection: this.collection
    });
    this.editModal = new EditModal({
      collection: this.collection
    });
    this.addModal = new AddModal({
      collection: this.collection
    });
    this.render();
    this.listenTo(this.collection, 'updateEditModal', this.handleUpdateEventModal);
  },
  render() {
    this.$el.html('');
    this.$el.append(addNewEventButton());
    this.$el.append(this.filterChooser.el);
    this.$el.append(this.individualEventBlock.el);
    this.$el.prepend(this.editModal.el);
    this.$el.prepend(this.addModal.el);
    return this;
  },
  events: {
    'click .addEvent': 'handleAddEventModal'
  },
  handleAddEventModal() {
    this.addModal.trigger('updateAddView');
  },
  handleUpdateEventModal(model) {
    this.editModal.trigger('updateEditView', model);
  }
});

const IndividualEventBlock = Backbone.View.extend({
  initialize() {
    this.listenTo(this.collection, 'updated', this.render);
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  events: {
    'click .back-to-top': 'backToTop'
  },
  backToTop() {
    $(window).scrollTop(0);
  },
  renderSpinner() {
    if (!this.collection.initialLoad) {
      this.$el.prepend(new spinner().el);
    }
  },
  backToTopButton() {
    return `
    <button class="btn btn-primary back-to-top"><i class="glyphicon glyphicon-arrow-up"></i> Back to Top</button><br><br>
    `;
  },
  addAddButton() {
    // append additional add button at the bottom in the case of > 0 events
    if(!this.collection.length) return;
    this.$el.append(addNewEventButton());
    this.$el.append(this.backToTopButton());
  },
  filterCollection(collection) {

    // special case for shading
    if (this.model.get('filter').shading === 'yes') {
      return collection.where({shading: 'full'}).concat(collection.where({shading: 'bars'}).concat(collection.where({shading: 'diagonal'})));
    }

    return collection.where(this.model.get('filter'));
  },
  render() {
    this.$el.html('');
    this.renderSpinner();

    this.filterCollection(this.collection).reverse().forEach(function(x) {
      this.$el.append(new IndividualEvent({
        model: x,
        collection: this.collection
      }).el);
    }, this);
    this.addAddButton();
    return this;
  }
});

const IndividualEvent = Backbone.View.extend({
  initialize() {
    this.render();
  },
  className: 'individual-event-block',
  events: {
    'click .editEvent': 'editEvent',
    'click .deleteButton': 'deleteRecord',
  },
  editEvent() {
    this.collection.trigger('updateEditModal', this.model);
  },
  deleteRecord() {
    if (window.confirm(`confirm deletion of ${this.model.get('text')}`)) {
      database.remove(this.model.cid);
      return null;
    } else {
      return null;
    }
  },
  render() {
    this.$el.html(`
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary btn-sm editEvent" data-toggle="modal" data-target="#editModal">
    Edit
    </button>

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
    skip counting school day: ${this.model.get('skipCount')}<br>
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
    this.listenTo(this.model, 'change', this.render);
  },
  className: 'filter-chooser well',
  events: {
    click: 'clickHandler'
  },
  clickHandler(e) {
    let clickTarget = $(e.target).data('filter');
    if (clickTarget === undefined) return null;
    if (clickTarget === 'all') {
      this.model.set({'filter': {}});
    } else if (clickTarget === 'skipCount') {
      this.model.set({'filter': {skipCount: 'yes'}});
    } else if (clickTarget === 'asp') {
      this.model.set({'filter': {asp: 'yes'}});
    } else if (clickTarget === 'mlh') {
      this.model.set({'filter': {mlh: 'yes'}});
    } else if (clickTarget === 'previousSundown') {
      this.model.set({'filter': {previousSundown: 'yes'}});
    } else if (clickTarget === 'proclamation') {
      this.model.set({'filter': {proclamation: 'yes'}});
    } else if (clickTarget === 'shading') {
      this.model.set({'filter': {shading: 'yes'}});
    } else {
      this.model.set({'filter': {repeat: clickTarget}});
    }
  },
  template: _.template(`Filter by:
  <span class="<% if(this.model.get('filter').repeat === 'annual')print('active') %>" data-filter="annual">
  Annual</span> |

  <span class="<% if(this.model.get('filter').repeat === 'variable')print('active') %>" data-filter="variable">
  Changing</span> |

  <span class="<% if(this.model.get('filter').repeat === 'banner')print('active') %>" data-filter="banner">Month</span> |

  <span class="<% if(this.model.get('filter').shading === 'yes')print('active') %>" data-filter="shading">Shading</span> |

  <span class="<% if(this.model.get('filter').mlh === 'yes')print('active') %>" data-filter="mlh">MLH</span> |

  <span class="<% if(this.model.get('filter').asp === 'yes')print('active') %>" data-filter="asp">ASP</span> |

  <span class="<% if(this.model.get('filter').proclamation === 'yes')print('active') %>" data-filter="proclamation">Proclamation</span> |

  <span class="<% if(this.model.get('filter').previousSundown === 'yes')print('active') %>" data-filter="previousSundown">Sundown</span> |

  <span class="<% if(this.model.get('filter').skipCount === 'yes')print('active') %>" data-filter="skipCount">Skip Count</span> |

  <span class="<% if(Object.keys(this.model.get('filter')).length === 0)print('active') %>" data-filter="all">All Events</span>`
  ),
  render() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

export function addNewEventButton() {
  return `
    <br>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary btn-lg addEvent" data-toggle="modal" data-target="#addModal">
    Add New Event
    </button>
    `;
}
