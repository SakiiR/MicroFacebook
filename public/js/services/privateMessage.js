'use strict';

var PrivateMessageService = function($http) {
  var service = {};

  service.getAllConcerned = function() {
    return $http.get('/private_message/all_concerned').then(handleSuccess, handleError('Failed to get all concerned message'));
  };

  service.getAllReceived = function() {
    return $http.get('/private_message/all_received').then(handleSuccess, handleError('Failed to get all received message'));
  };

  service.getAllUnread = function() {
    return $http.get('/private_message/all_unreaded').then(handleSuccess, handleError('Failed to get all unreaded message'));
  };

  service.countUnreaded = function() {
    return $http.get('/private_message/count_unreaded').then(handleSuccess, handleError('Failed to count unreaded messages'));
  };

  service.new = function(content, destination) {
    return $http.post('/private_message/new', {content : content, destination : destination}).then(handleSuccess, handleError('Failed to post message'));
  };

  var handleSuccess = function(res) { return res.data };
  var handleError   = function(error) { return function() { return { success : false, message : error } } };

  return service;
};

// Private Message Service API
app.factory('PrivateMessageService', PrivateMessageService);

PrivateMessageService.$inject = ['$http'];
