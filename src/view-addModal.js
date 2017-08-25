import Backbone from 'backbone';
import { EditView } from './view-edit';
import EventModel from './model-event';

const AddModal = Backbone.View.extend({
  initialize() {
    this.render();
    this.listenTo(this, 'updateAddView', this.updateAddView);
  },
  updateAddView() {
    this.$el.find('.modal-body').html('');

    // populate EditView with 'add' variant of EventModel
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
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="addModalLabel">Add Event</h4>
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

export default AddModal;
