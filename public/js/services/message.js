'use strict'

var MessageService = function($http) {
  var service = {};

  service.getAll = function() {
    return $http.get('/message/all').then(handleSuccess, handleError('Failed to retreive message'));
  };

  service.new = function(content) {
    return $http.post('/message/new', {content : content}).then(handleSuccess, handleError('Failed to create message'));
  };

  service.delete = function(message_id) {
    return $http.post('/message/' + message_id + '/delete').then(handleSuccess, handleError('Failed to remove message'));
  };

  var handleSuccess = function(res) { return res.data };
  var handleError   = function(error) { return function() { return { success : false, message : error } } };

  return service;
};

// Message Service API
app.factory('MessageService', MessageService);

MessageService.$inject = ['$http'];
