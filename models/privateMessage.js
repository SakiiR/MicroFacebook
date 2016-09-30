// Mongoose Private Message Schema

var mongoose = require('mongoose');

var PrivateMessageSchema = new mongoose.Schema({
  content     : { type : String  },
  readed      : { type : Boolean },
  source      : { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
  destination : { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
  created     : 'Moment'
});

module.exports = mongoose.model('PrivateMessage', PrivateMessageSchema);
