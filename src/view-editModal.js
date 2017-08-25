import Backbone from 'backbone';
import { EditView } from './view-edit';

const EditModal = Backbone.View.extend({
  initialize() {
    this.render();
    this.listenTo(this, 'updateEditView', this.updateEditView);
  },
  updateEditView(model) {
    this.$el.find('.modal-body').html('');

    // populate EditView with passed-in model for editing
    this.$el.find('.modal-body').append(new EditView({
      model
    }).el);
  },
  render() {
    this.$el.html('');
    this.$el.append(`
      <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="editModalLabel">Edit Event</h4>
            </div>
            <div class="modal-body">

            </div>

          </div>
        </div>
      </div>
  `);
    return this;
  }
});

export default EditModal;
