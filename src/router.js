import $ from 'jquery';
import Backbone from 'backbone';
import { HomeView, EventsView } from './view-home';

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
    "home": "home",
    "events": "events",
    "*default": "home"
  },

  home() {
    $('#root').html(ViewManager.showView(HomeView))
  },

  events() {
    $('#root').html(ViewManager.showView(EventsView))
  }

});

export default applicationRouter;
