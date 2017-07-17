import $ from 'jquery';
import Backbone from 'backbone';
import { SortView } from './view-sort';
import { EventsView } from './view-events';

var ViewManager = {
    currentView : null,
    showView : function(view) {
        if (this.currentView !== null && this.currentView.cid != view.cid) {
            this.currentView.remove();
        }
        this.currentView = view;
        return new view().el;
    }
}

const applicationRouter = Backbone.Router.extend({
  routes: {
    "sort": "sort",
    "events": "events",
    "*default": "home"
  },

  sort() {
    $('#root').html(ViewManager.showView(SortView))
  },

  events() {
    $('#root').html(ViewManager.showView(EventsView))
  }

});

export default applicationRouter;
