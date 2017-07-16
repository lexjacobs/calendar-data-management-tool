import Backbone from 'backbone';
import dataset from './dataset';

const database = new Backbone.Collection(dataset);

export default database;
