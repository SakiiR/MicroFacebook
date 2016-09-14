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
app.user(bodyParser.json());

// Default Port
var PORT = ( process.env.PORT || 1337 );
