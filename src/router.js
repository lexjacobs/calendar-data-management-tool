import $ from 'jquery';
import Backbone from 'backbone';
import { SortView } from './view-sort';
import { EventsView } from './view-events';
import { EditView } from './view-edit';

var ViewManager = {
    currentView : null,
    showView : function(view, ...extras) {
        if (this.currentView !== null && this.currentView.cid !== view.cid) {
            this.currentView.stopListening();
            this.currentView.remove();
        }
        this.currentView = view;

        return new view({
          routeParameters: extras
        }).el;
    }
}

const ApplicationRouter = Backbone.Router.extend({
  routes: {
    "sort": "sort",
    "events": "events",
    "edit/:cid": "edit",
    "*default": "events"
  },

  edit(...cid) {
    $('#root').html(ViewManager.showView(EditView, ...cid))
  },

  sort() {
    $('#root').html(ViewManager.showView(SortView))
    $('ul.nav-pills > li').removeClass('active');
    $('ul.nav-pills > li.nav-item.sort').addClass('active');
  },

  events() {
    $('#root').html(ViewManager.showView(EventsView))
    $('ul.nav-pills > li').removeClass('active');
    $('ul.nav-pills > li.nav-item.events').addClass('active');
  }

});

export default ApplicationRouter;
