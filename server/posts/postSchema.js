var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
  update: { type: String, required: true }
});

module.exports = postSchema;