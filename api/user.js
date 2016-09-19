var express  = require('express');
var passport = require('passport');
var User     = require('../models/user.js'); // User Model
var Message  = require('../models/message.js'); // Message Model
var sha512   = require('sha512');
var jwt      = require('jsonwebtoken');
var utils    = require('../utils/config.js');

var router = express.Router();


// Route('/user')
router.get('/', function(request, response) {
  response.send('User home');
});

// Route('/user/test')
router.get('/test', utils.ensureAuthorized, function(request, response) {
  response.send('Test ok ' + request.user._id);
});

// Route('/user/new')
router.post('/new', function(request, response) {
  if (
    !request.body.firstname ||
    !request.body.lastname ||
    !request.body.email ||
    !request.body.username ||
    !request.body.password) {
    return response.json({success : false, message : 'Missing Fiel(s)'});
  }

  var newUser = new User({
    firstname : request.body.firstname,
    lastname  : request.body.lastname,
    username  : request.body.username,
    email     : request.body.email,
    password  : utils.createHash(request.body.password)
  });

  newUser.save(function(err) {
    if (err) {
      if (err.message.indexOf('duplicate') >= 0) { // Duplicate key
        return response.json({success : false, message : 'User Already Exist !'});
      }
      return response.json({success : false, message : 'Mongo Error : ' + err.message});
    }
    response.json({success : true, message : 'User Registered Successfully !'});
  });
});

// Route('/user/auth')
router.post('/auth', function(request, response) {
  User.findOne({'username' : request.body.username}, function(err, user) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!user) return response.json({success : false, message : 'Failed to find user'});
    if (utils.createHash(request.body.password) === user.password) {
        var token = jwt.sign(user, utils.secret, {
          expiresIn: 10080 // in seconds
        });
        // token = token;
        user.password = undefined;
        return response.json({success : true, token : token, user : user, message : 'Successfully Authed!'});
      }
      return response.json({success : false, message : 'Failed to Auth, bad Password'});
    });
});

// Route('/user/:id')
router.get('/:id', utils.ensureAuthorized, function(request, response) {
  var user_id = request.params.id
  User.findOne({ _id : user_id }, function(err, user) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!user) return response.json({success : false, message : 'Failed to find user with id ' + user_id});
    user.password = undefined;
    user.followers.filter(function(item) {
      item.password = undefined;
    });
    Message.find({author : user._id}, function(err, messages) {
      if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
      response.json({success : true, message : 'Success !', user : user, messages : messages});
    });
  }).populate('followers');
});

// Route('/user/all')
router.get('/get/all', utils.ensureAuthorized, function(request, response) {
  User.find(function(err, users) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    users.filter(function(item) {
      item.password = undefined;
    });
    response.send({ success : true, message : 'Success ! ', users : users });
  });
});

// Route('/user/:id/follow')
// TODO:Replace mongoose get User by a direct mongo request
router.post('/:id/follow', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, 'MySecretString')._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to Verify token'});
  User.findOne({_id : request.params.id}, function(err, user) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!user) return response.json({success : false, message : 'Failed to find user ' + request.params.id});
    user.followers.push(currentUser._id);
    user.save(function(err) {
      if (err) return response.json({success : false, message : 'Failed to save user ..'});
      response.json({success : true, message : 'Following!'});
    });
  });
});

// Route('/user/:id/unfollow')
// TODO:Replace mongoose get User by a direct mongo request
router.post('/:id/unfollow', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, 'MySecretString')._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to Verify token'});
  User.findOne({_id : request.params.id}, function(err, user) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!user) return response.json({success : false, message : 'Failed to find user ' + request.params.id});
    user.followers.splice(user.followers.indexOf(currentUser._id), 1);
    user.save(function(err) {
      if (err) return response.json({success : false, message : 'Failed to save user ..'});
      response.json({success : true, message : 'Unfollowing!'});
    });
  });
});

module.exports = router;
