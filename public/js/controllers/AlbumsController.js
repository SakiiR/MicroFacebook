'use strict';

app.controller('AlbumsController', ['$scope', 'UserService', '$routeParams', 'AlbumService', function($scope, UserService, $routeParams, AlbumService) {
    // Add Content

    $scope.currentUser = {  };

    $scope.init = function() {
        UserService.getUser($routeParams.id).then(function(response) {
            $scope.currentUser = response.user;
            AlbumService.getByUser($routeParams.id).then(function(response) {
                $scope.currentUser.albums = response.user.albums;
            });
        });
    };


    $scope.init();
}]);
