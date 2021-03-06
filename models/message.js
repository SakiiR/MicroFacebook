// Mongoose Message Schema

var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  content    : { type : String, required : true },
  author     : { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
  created    : 'Moment'
});

module.exports = mongoose.model('Message', MessageSchema);
