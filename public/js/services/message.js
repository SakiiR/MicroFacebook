'use strict'

var MessageSerice = function($http) {
  var service = {};

  service.getALl = function() {
    $http.get('/message/all').then(handleSuccess, handleError('Failed to retreive message'));
  };

  var handleSuccess = function(res) { return res.data };
  var handleError   = function(error) { return function() { return { success : false, message : error } } };

  return service;
};

// User Service API
app.factory('MessageSerice', MessageSerice);

MessageSerice.$inject = ['$http'];
