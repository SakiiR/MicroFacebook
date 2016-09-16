// Mongoose User Schema

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstname : {type : String, required : true, unique : false},
  lastname  : {type : String, required : true, unique : false},
  username  : {type : String, required : true, unique : true, dropDups: true},
  email     : {type : String, required : true, unique : true, dropDups: true, match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
  password  : {type : String, required : true, unique : false},
  followers : [{type : mongoose.Schema.Types.ObjectId, ref : 'User'}],
});

module.exports = mongoose.model('User', UserSchema);
