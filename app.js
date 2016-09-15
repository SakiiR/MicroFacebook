// Simple Social Network
//
// Author : Erwan Dupard (erwan.dupard@epitech.eu)

var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var app            = express();
var mongoose       = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var userApi        = require('./api/user.js');
var User           = require('./models/user.js');
var expressSession = require('express-session');
var jwt            = require('jsonwebtoken');

// Configure Express App
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use('/static', express.static('public'));
app.use(expressSession({
  secret: 'mySecretKey',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Mongoose Connection
mongoose.connect('mongodb://localhost:27017/microfb');

// Passport Configuration

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

app.listen(PORT, function(err) {
  console.log('[+] Listenning on http://localhost:' + PORT);
});
