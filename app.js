// Simple Social Network
//
// Author : Erwan Dupard (erwan.dupard@epitech.eu)

var express           = require('express');
var morgan            = require('morgan');
var bodyParser        = require('body-parser');
var app               = express();
var server            = require('http').createServer(app);
var io                = require('socket.io').listen(server);
var mongoose          = require('mongoose');
var passport          = require('passport');
var JwtStrategy       = require('passport-jwt').Strategy;
var ExtractJwt        = require('passport-jwt').ExtractJwt;
var userApi           = require('./api/user.js');
var messageApi        = require('./api/message.js');
var privateMessageApi = require('./api/privateMessage.js');
var User              = require('./models/user.js');
var utils             = require('./utils/config.js');
var socketioJwt       = require('socketio-jwt');

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

// WebSockets
// io.sockets.on('connection', function(socket) {
//     socket.emit('identity', socket.handshake.identity);
//     socket.on('updated_message', function(message) {
//         socket.broadcast.emit('updated_message', message);
//     });
// });

io.sockets.on('connection', socketioJwt.authorize({
    secret: utils.secret,
    timeout: 15000
})).on('authenticated', function(socket) {
    var user = socket.decoded_token._doc;
    socket.on('updated_message', function() {
        io.sockets.emit('updated_message');
    });
});


// Router Definition
app.use('/', router);
app.use('/user', userApi);
app.use('/message', messageApi);
app.use('/private_message', privateMessageApi);

server.listen(PORT, function() {
  console.log('[+] Listenning on http://localhost:' + PORT);
});
