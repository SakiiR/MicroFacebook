// Simple Social Network
//
// Author : Erwan Dupard (erwan.dupard@epitech.eu)

var express    = require('express');
var morgan     = require('morgan');
var bodyParser = require('body-parser');
var app        = express();
var mongoose   = require('mongoose');

// Configure Express APp
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use('/static', express.static('public'));

// Router Instanciation
var router = express.Router();

// Default Port
var PORT = ( process.env.PORT || 1337 );

// Default Route ( Render my Single Page App )
router.get('*', function(request, response){
    response.sendFile(__dirname + '/views/index.html');
});

// Default Route API
router.get('/', function(request, response) {
  response.send('API 1.0');
});

// Router Definition
app.use('/', router);

app.listen(PORT, function(err) {
  console.log('[+] Listenning on http://localhost:' + PORT);
});
