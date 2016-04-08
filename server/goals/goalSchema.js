var mongoose = require('mongoose');
var GoalUpdateSchema = require('../goalUpdate/goalUpdateSchema.js')

var Schema = mongoose.Schema;

var GoalSchema = new Schema({
  goal: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  due_date: { type: Date },
  updates: [GoalUpdateSchema]
});

module.exports = GoalSchema;