var express  = require('express');
var passport = require('passport');
var User     = require('../models/user.js'); // User Model
var sha512   = require('sha512');
var jwt      = require('jsonwebtoken');

var SECRET   = 'MySecretString';

var router = express.Router();

// Generates hash using bCrypt
var createHash = function(password){
  return sha512(password).toString('hex');
};

// Route('/user')
router.get('/', function(request, response) {
  response.send('User home');
});

// Route('/user/test')
router.get('/test',passport.authenticate('jwt', { session : false }), function(request, response) {
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
    password  : createHash(request.body.password)
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
    if (createHash(request.body.password) === user.password) {
        var token = jwt.sign(user, SECRET, {
          expiresIn: 10080 // in seconds
        });
        token = 'JWT ' + token;
        user.password = undefined;
        return response.json({success : true, token : token, user : user, message : 'Successfully Authed!'});
      }
      return response.json({success : false, message : 'Failed to Auth, bad Password'});
    });
});

// Route('/user/:id')
router.get('/:id', passport.authenticate('jwt', { session : false }), function(request, response) {
  var user_id = request.params.id
  User.findOne({ _id : user_id }, function(err, user) {
    if (err) return response.json({success : false, message : 'Mongo Error : ' + err.message});
    if (!user) return response.json({success : false, message : 'Failed to find user with id ' + user_id});
    user.password = undefined;
    response.json({success : true, message : 'Success !', user : user});
  });
});

module.exports = router;
