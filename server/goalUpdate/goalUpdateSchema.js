var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GoalUpdateSchema = new Schema({
  update: { type: String, required: true },
  updated_at: { type: Date, default: Date.now }
});

module.exports = GoalUpdateSchema;