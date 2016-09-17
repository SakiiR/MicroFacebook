// Mongoose Post Schema

var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  content    : { type : String, required : true },
  author     : { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
