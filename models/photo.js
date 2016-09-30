// Mongoose Photo Schema

var mongoose = require('mongoose');

var PhotoSchema = new mongoose.Schema({
    name   : {type : String, required : true},
    url    : {type : String, required : true}
});

module.exports = mongoose.model('Photo', PhotoSchema);