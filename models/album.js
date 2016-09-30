// Mongoose Album Schema

var mongoose = require('mongoose');

var AlbumSchema = new mongoose.Schema({
    name    : {type : String, required : true},
    photos  : [{type : mongoose.Schema.Types.ObjectId, ref : 'Photo'}],
    user    : {type : mongoose.Schema.Types.ObjectId, ref : 'User'}
});

module.exports = mongoose.model('Album', AlbumSchema);
