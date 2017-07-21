import Backbone from 'backbone';
import '../node_modules/bootstrap/js/modal.js';
import { EditView } from './view-edit';

const EditModal = Backbone.View.extend({
  initialize() {
    this.render();
    this.listenTo(this, 'updateEditView', this.updateEditView);
  },
  updateEditView(cid) {
    this.$el.find('.modal-body').html('');
    this.$el.find('.modal-body').append(new EditView({
      cid
    }).el);
  },
  events: {
    'click button.submit': 'handleClick'
  },
  handleClick() {
    console.log('heard click');
  },
  render() {
    this.$el.html('');
    this.$el.append(`
      <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">click here, ESC, or click away to cancel &times;</span></button>
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
