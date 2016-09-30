var express  = require('express');
var passport = require('passport');
var Message  = require('../models/message.js'); // User Model
var jwt      = require('jsonwebtoken');
var utils    = require('../utils/config.js');
var Moment   = require('moment');

var router = express.Router();

/*
 * @Route('/message/all')
 * Description: Get All Public Messages
 */
router.get('/all', utils.ensureAuthorized, function(request, response) {
  Message.find({}, function(err, messages) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    return response.json({success : true, message : 'Success !', messages : messages});
  }).populate('author');
});

/*
 * @Route('/message/new')
 * Description: Send A New Public Message
 */
router.post('/new', utils.ensureAuthorized, function(request, response) {
  if (!request.body.content) return response.json({success : false, message : 'Failed to parse message'});
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to decode token'});
  var msg = new Message({
    content : request.body.content,
    author  : currentUser._id,
    created : new Moment()
  });
  msg.save(function(err) {
    if (err) return response.json({success : false, message : 'Failed to save message'});
    Message.populate(msg,  {path: 'author'}, function(err, msg) {
      if (err) return response.json({success : false, message : 'Failed to populate message'});
      response.json({success : true, message : 'Success !', msg : msg});
    });
  });
});

/*
 * @Route('/message/:id/delete')
 * Description: Delete A Public Message By ID
 */
router.post('/:id/delete', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to decode token'});
  Message.findOne({_id : request.params.id}, function(err, message) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!message) return response.json({success : false, message : 'Failed to find message'});
    if (message.author.toString() !== currentUser._id) return response.json({sucess : false, message : 'You are not owning this message'});
    Message.remove({_id : message._id}, function(err) {
      if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
      return response.json({success : true, message : 'Success !'});
    });
  });
});

module.exports = router;
