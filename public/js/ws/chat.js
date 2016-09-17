'use strict';

var socket = new io();
socket.connect('http://localhost:8080', { autoConnect: true});
