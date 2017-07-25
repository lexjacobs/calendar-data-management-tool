import Backbone from 'backbone';
import '../node_modules/bootstrap/js/modal.js';
import { EditView } from './view-edit';
import EventModel from './model-event';

const AddModal = Backbone.View.extend({
  initialize() {
    this.render();
    this.listenTo(this, 'updateAddView', this.updateAddView);
  },
  updateAddView() {
    this.$el.find('.modal-body').html('');
    this.$el.find('.modal-body').append(new EditView({
      model: new EventModel({}),
      variant: 'add'
    }).el);
  },
  render() {
    this.$el.html('');
    this.$el.append(`
      <div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="addModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">click here, ESC, or click away to cancel &times;</span></button>
              <h4 class="modal-title" id="addModalLabel">Add Event</h4>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal">Close Add Menu Without Update</button>
            </div>

          </div>
        </div>
      </div>
  `);
    return this;
  }
});

export default AddModal;
