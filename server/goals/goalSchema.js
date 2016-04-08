var mongoose = require('mongoose');
var PostSchema = require('../posts/postSchema.js')

var Schema = mongoose.Schema;

var GoalSchema = new Schema({
  goal: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  due_date: { type: Date },
  posts: [PostSchema]
});

module.exports = GoalSchema;