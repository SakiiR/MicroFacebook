var express  = require('express');
var passport = require('passport');
var User     = require('../models/user.js'); // User Model
var bCrypt   = require('bcrypt-nodejs');

var router = express.Router();

// Generates hash using bCrypt
var createHash = function(password){
  return bCrypt.hashSync(password);
};

// Route('/user')
router.get('/', function(request, response) {
  response.send('User home');
});

// Route('/user/test')
router.get('/test', function(request, response) {
  response.send('User test');
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
    if (err) return response.json({success : false, message : 'Failed To Save User'});
    response.json({success : true, message : 'User Registered Successfully !'});
  });
});

module.exports = router;
