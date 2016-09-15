// Mongoose User Schema

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstname : {type : String, required : true, unique : false},
  lastname  : {type : String, required : true, unique : false},
  username  : {type : String, required : true, unique : true, dropDups: true},
  email     : {type : String, required : true, unique : true, dropDups: true},
  password  : {type : String, required : true, unique : false}
});

module.exports = mongoose.model('users', UserSchema);
