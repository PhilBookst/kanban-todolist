const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now()},
  kanbans: [{ type: Schema.Types.ObjectId, ref:'Kanban' }],
  fields: { type: [String], default: ['Today', 'Tomorrow', 'Finished'] },
});

const User = mongoose.model('User', userSchema);

module.exports = User;