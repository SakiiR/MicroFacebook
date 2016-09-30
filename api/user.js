var express  = require('express');
var User     = require('../models/user.js'); // User Model
var Album    = require('../models/album.js'); // Album Model
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

/**
 * @Route('/user/new')
 * Description: Register A New User
 */
router.post('/new', function(request, response) {
  if (
    !request.body.first_name ||
    !request.body.last_name  ||
    !request.body.email     ||
    !request.body.username  ||
    !request.body.password) {
    return response.json({success : false, message : 'Missing Fiel(s)'});
  }
  var newUser = new User({
    first_name : request.body.first_name,
    last_name  : request.body.last_name,
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

/**
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

/**
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
    response.json({success : true, message : 'Success !', user : user});
  }).populate('followers');
});

/**
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

/**
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
      if (err) return response.json({success : false, message : 'Failed to save user ..' + err.message});
      response.json({success : true, message : 'Following!'});
    });
  });
});

/**
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

/**
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

/**
 * @Route('/use/add_friend')
 * Description: Add a friend
 */
router.post('/add_friend', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to Verify token'});
  var user_id = request.body.user_id;
  if (!user_id) return response.json({success : false, message : 'please, give me a user id'});
  User.findOne({_id : user_id}, function(err, friend) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!friend) return response.json({success : false, message : 'Failed to find user by user_id : ' + user_id});
    User.findOne({_id : currentUser._id}, function(err, me) {
      if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
      if (!friend) return response.json({success : false, message : 'Failed to find user by user_id : ' + user_id});
      if (me.friends_list.indexOf(friend._id) === -1) me.friends_list.push(friend._id);
      me.save(function(err) {
        if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
        me.password = undefined;
        return response.json({success : true, message : 'Success !', me : me, friend : friend});
      });
    });
  });
});

/**
 * @Route('/user/remove_friend')
 * Description: Remove a friend
 */
router.post('/remove_friend', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to Verify token'});
  var user_id = request.body.user_id;
  if (!user_id) return response.json({success : false, message : 'please, give me a user id'});
  User.findOne({_id : user_id}, function(err, friend) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!friend) return response.json({success : false, message : 'Failed to find user by user_id : ' + user_id});
    User.findOne({_id : currentUser._id}, function(err, me) {
      if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
      if (!friend) return response.json({success : false, message : 'Failed to find user by user_id : ' + user_id});
      me.friends_list.splice(me.friends_list.indexOf(friend._id), 1);
      me.save(function(err) {
        if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
        return response.json({success : true, message : 'Success !', me : me, friend : friend});
      });
    });
  });
});


/**
 * @Route('/user/:id/album')
 * Description: Retreive User Album
 */
router.get('/:id/album', utils.ensureAuthorized, function(request, response) {
  var currentUser = jwt.verify(request.token, utils.secret)._doc;
  if (!currentUser) return response.json({success : false, message : 'Failed to Verify token'});

  User.findOne({_id : request.params.id}, function(err, user) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!user) return response.json({success : false, message : 'Failed to find user ' + request.params.id});
    if (!utils.areFriends(user, currentUser)) return response.json({success : false, message : 'You are not friend with this user'});
    Album.find({user : request.params.id}, function(err, albums) {
      if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
      return response.json({success : true, message : 'Success!', albums : albums});
    });
  });
});



module.exports = router;
