/* global test expect */
import { addNewEventButton } from './view-events';

test('it renders an addNewEventButton', () => {
  expect(addNewEventButton()).toEqual(`
    <br>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary btn-lg addEvent" data-toggle="modal" data-target="#addModal">
    Add New Event
    </button>
    `);
});
