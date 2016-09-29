var express  = require('express');
var User     = require('../models/user.js'); // User Model
var Message  = require('../models/message.js'); // Message Model
var jwt      = require('jsonwebtoken');
var utils    = require('../utils/config.js');
var multer   = require('multer');

var upload   = multer({
  dest: 'public/uploads/',
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb("Availaible extentions : jpg, jpeg, png, gif");
    }
    cb(null, true);
  }
});

var router = express.Router();

/*
 * @Route('/user/new')
 * Description: Register A New User
 */
router.post('/new', function(request, response) {
  if (
    !request.body.firstname ||
    !request.body.lastname  ||
    !request.body.email     ||
    !request.body.username  ||
    !request.body.password) {
    return response.json({success : false, message : 'Missing Fiel(s)'});
  }
  var newUser = new User({
    firstname : request.body.firstname,
    lastname  : request.body.lastname,
    username  : request.body.username,
    email     : request.body.email,
    password  : utils.createHash(request.body.password),
    avatar    : null
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

/*
 * @Route('/user/auth')
 * Description: Auth A User By Username AND Password
 */
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

/*
 * @Route('/user/:id')
 * Description: Retreive Single User Information
 */
router.get('/:id', utils.ensureAuthorized, function(request, response) {
  var user_id = request.params.id;
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

/*
 * @Route('/user/get/all')
 * Description: Retreive A Complete User List
 */
router.get('/get/all', utils.ensureAuthorized, function(request, response) {
  User.find(function(err, users) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    users.filter(function(item) {
      item.password = undefined;
    });
    response.send({ success : true, message : 'Success ! ', users : users });
  });
});

/*
 * @Route('/user/:id/follow')
 * Description: Follow A User
 */
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

/*
 * @Route('/user/:id/unfollow')
 * Description: Unfollow A User
 */
router.post('/:id/unfollow', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
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

/*
 * @Route('/user/avatar')
 * Description: Update user avatar
 */
router.post('/avatar', upload.single('file'), utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to Verify token'});
  var avatarUrl = request.file.path.replace('public/', 'static/');

  User.findOne({_id : currentUser._id}, function(err, user) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!user) return response.json({success : false, message : 'Failed to find user ' + currentUser._id});
    user.avatar = avatarUrl;
    user.save(function(err) {
      if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
      return response.json({success : true, message : 'Success !', avatarUrl : avatarUrl });
    });
  });
});

module.exports = router;
