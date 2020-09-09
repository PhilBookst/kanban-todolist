const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kanbanSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' }, 
  task: {type:String, required: true, unique: true},
  due: {type:String, required: true},
});

const Kanban = mongoose.model('Kanban', kanbanSchema);

module.exports = Kanban;