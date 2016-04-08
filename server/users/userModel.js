var mongoose = require('mongoose');
var GoalSchema = require('../goals/goalSchema.js')

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type : String, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  goals: [GoalSchema],
  friends: [{ type : Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);