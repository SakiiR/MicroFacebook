'use strict'

var UserService = function($http) {
  var service = {};

  service.authUser = function(username, password) {
    return $http.post('/user/auth', {username : username, password : password}).then(handleSuccess, handleError('Failed to auth user'));
  };

  service.newUser = function(firstname, lastname, email, username, password) {
    return $http.post('/user/new', {firstname : firstname, lastname : lastname, email : email, username : username, password : password}).then(handleSuccess, handleError('Failed to auth user'));
  };

  service.getUser = function(user_id) {
    return $http.get('/user/' + user_id).then(handleSuccess, handleError('Failed to retreive user'));
  };

  service.getAll = function() {
    return $http.get('/user/get/all').then(handleSuccess, handleError('Failed to retreive users'));
  };

  service.followUser = function(user_id) {
    return $http.post('/user/' + user_id + '/follow').then(handleSuccess, handleError('Failed to follow user'));
  };

  service.unfollowUser = function(user_id) {
    return $http.post('/user/' + user_id + '/unfollow').then(handleSuccess, handleError('Failed to follow user'));
  };

  service.setAvatar = function(avatar) {
    var formData = new FormData();
    formData.append('file', avatar);
    return $http.post('/user/avatar', formData,  {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(handleSuccess, handleError('Failed to post avatar'));
  };

  var handleSuccess = function(res) { return res.data };
  var handleError   = function(error) { return function() { return { success : false, message : error } } };

  return service;
};

// User Service API
app.factory('UserService', UserService);

UserService.$inject = ['$http'];
