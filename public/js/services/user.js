'use strict'

var UserService = function($http) {
  var service = {};

  service.authUser = function(username, password) {
    return $http.post('/user/auth', {username : username, password : password}).then(handleSuccess, handleError('Failed to auth user'));
  };

  service.newUser = function(firstname, lastname, email, username, password) {
    return $http.post('/user/new', {firstname : firstname, lastname : lastname, email : email, username : username, password : password}).then(handleSuccess, handleError('Failed to auth user'));
  };

  var handleSuccess = function(res) { return res.data };
  var handleError   = function(error) { return function() { return { success : false, message : error } } };

  return service;
};

// User Service API
app.factory('UserService', UserService);

UserService.$inject = ['$http'];
