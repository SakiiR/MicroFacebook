var express         = require('express');
var PrivateMessage  = require('../models/privateMessage.js'); // User Model
var User            = require('../models/user.js'); // User Model
var jwt             = require('jsonwebtoken');
var utils           = require('../utils/config.js');
var Moment          = require('moment');

var router = express.Router();

/*
 * @Route('/private_message/all_received')
 * Description: Get ALL Received User Private Messages
 */
router.get('/all_received', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to decode token'});
  PrivateMessage.find({destination : currentUser._id}, function(err, messages) {
    if (err) return response.json({success : false, messsage : 'Mongo Error : ' + err .messsage});
    return response.json({success : true, message : 'Success!', messages : messages});
  }).populate('source').populate('destination');
});

/*
 * @Route('/private_message/all_concerned')
 * Description: Get ALL User Private Messages
 */
router.get('/all_concerned', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to decode token'});
  PrivateMessage.find({$or : [{'destination' : currentUser._id}, {'source' : currentUser._id}]}, function(err, messages) {
    if (err) return response.json({success : false, messsage : 'Mongo Error : ' + err .messsage});

    // Todo: Fix this
    messages.forEach(function (item) {
      item.source.password = undefined;
      item.destination.password = undefined;
      item.createdFormated = item.created.startOf('second').fromNow();
    });

    return response.json({success : true, message : 'Success!', messages : messages});
  }).populate('source').populate('destination');
});

/*
 * @Route('/private_message/all_unreaded')
 * Description: Get All Unreaded Messages By User
 */
router.get('/all_unreaded', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to decode token'});
  PrivateMessage.find({destination : currentUser._id}, function(err, messages) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    return response.json({success : true, message : 'Success!', messages : messages});
  }).populate('source').populate('destination');
});

/*
 * @Route('/private_message/count_unreaded')
 * Description: Count All Unreaded Message By User
 */
router.get('/count_unreaded', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to decode token'});
  PrivateMessage.count({destination : currentUser._id, readed : false}, function(err, count) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    return response.json({success : true, message : 'Success!', count : count});
  });
});

/*
 * @Route('/private_message/new')
 * Description: Send A New Private Message
 */
router.post('/new', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to decode token'});
  if (!request.body.destination) return response.json({success : false, message : 'Failed to retreive destination'});
  if (!request.body.content) return response.json({success : false, message : 'Failed to retreive content'});
  User.findOne({username : request.body.destination}, function(err, user) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!user) return response.json({success : false, message : 'Failed to find user : ' + request.body.destination});
    var destinationId = user._id.toString();
    if (currentUser._id === destinationId) return response.json({success : false, message : "You Can't Send Message To Yourself"});
    var message = new PrivateMessage({
      content     : request.body.content,
      readed      : false,
      source      : currentUser._id,
      destination : destinationId,
      created     : new Moment()
    });
    message.save(function(err) {
      if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
      response.json({success : true, message : 'Success!', msg : message});
    });
  });
});

module.exports = router;
