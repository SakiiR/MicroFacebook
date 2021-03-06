// Mongoose User Schema

var mongoose = require('mongoose');
require('mongoose-moment')(mongoose);

var UserSchema = new mongoose.Schema({
  first_name   : {type : String, required : true, unique : false},
  last_name    : {type : String, required : true, unique : false},
  username     : {type : String, required : true, unique : true, dropDups: true},
  email        : {type : String, required : true, unique : true, dropDups: true, match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
  password     : {type : String, required : true, unique : false},
  followers    : [{type : mongoose.Schema.Types.ObjectId, ref : 'User'}],
  avatar       : { type : String, unique : false },
  friends_list : [{type : mongoose.Schema.Types.ObjectId, ref : 'User'}],
  albums       : [{type : mongoose.Schema.Types.ObjectId, ref : 'Album'}]
});

module.exports = mongoose.model('User', UserSchema);
