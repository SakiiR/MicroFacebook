var express  = require('express');
var passport = require('passport');
var Message  = require('../models/message.js'); // User Model
var jwt      = require('jsonwebtoken');
var utils    = require('../utils/config.js');

var router = express.Router();

router.get('/all', utils.ensureAuthorized, function(request, response) {
  Message.find({}, function(err, messages) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    return response.json({success : true, message : 'Success !', messages : messages});
  }).populate('author');
});

router.post('/new', utils.ensureAuthorized, function(request, response) {
  if (!request.body.content) return response.json({success : false, message : 'Failed to parse message'})
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to decode token'});
  var msg = new Message({
    content : request.body.content,
    author  : currentUser._id
  });
  msg.save(function(err) {
    if (err) return response.json({success : false, message : 'Failed to save message'});
    response.json({success : true, message : 'Success!'});
  });
});

module.exports = router;
