// Simple Social Network
//
// Author : Erwan Dupard (erwan.dupard@epitech.eu)

var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var app            = express();
var mongoose       = require('mongoose');
var passport       = require('passport');
var JwtStrategy    = require('passport-jwt').Strategy;
ExtractJwt         = require('passport-jwt').ExtractJwt;
var userApi        = require('./api/user.js');
var messageApi        = require('./api/message.js');
var User           = require('./models/user.js');
var Message        = require('./models/message.js');
var expressSession = require('express-session');
var jwt            = require('jsonwebtoken');
var utils          = require('./utils/config.js');

// Configure Express App
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use('/static', express.static('public'));
app.use(passport.initialize());

// Mongoose Connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/microfb');

// Passport Configuration
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: utils.secret
  }, function(jwt_payload, done) {
  User.findOne({ id: jwt_payload.id }, function(err, user) {
    if (err) return done(err, false);
    if (user) return  done(null, user);
    return done(null, false);
  });
}));

// Router Instanciation
var router = express.Router();

// Default Port
var PORT = ( process.env.PORT || 1337 );

// Default Route ( Render my Single Page App )
router.get('/', function(request, response){
    response.sendFile(__dirname + '/views/index.html');
});

// Router Definition
app.use('/', router);
app.use('/user', userApi);
app.use('/message', messageApi);

app.listen(PORT, function(err) {
  console.log('[+] Listenning on http://localhost:' + PORT);
});
