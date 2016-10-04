'use strict';

var AlbumService = function($http) {
    var service = {};

    service.new = function(name) {
        return $http.post('/album/new', {name : name}).then(handleSuccess, handleError('Failed to post album'));
    };

    service.getByUser = function(user_id) {
        return $http.get('/user/' + user_id + '/albums').then(handleSuccess, handleError('Failed to retreive albums'));
    };

    var handleSuccess = function(res) { return res.data };
    var handleError   = function(error) { return function() { return { success : false, message : error } } };

    return service;
};

// AlbumService API
app.factory('AlbumService', AlbumService);

AlbumService.$inject = ['$http'];
