'use strict'

var MessageService = function($http) {
  var service = {};

  service.getAll = function() {
    return $http.get('/message/all').then(handleSuccess, handleError('Failed to retreive message'));
  };

  service.new = function(content) {
    return $http.post('/message/new', {content : content}).then(handleSuccess, handleError('Failed to create message'));
  };

  var handleSuccess = function(res) { return res.data };
  var handleError   = function(error) { return function() { return { success : false, message : error } } };

  return service;
};

// User Service API
app.factory('MessageService', MessageService);

MessageService.$inject = ['$http'];
