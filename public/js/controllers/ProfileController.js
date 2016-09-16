'use strict';

app.controller('ProfileController', ['$scope', '$routeParams', 'UserService', '$location', function($scope, $routeParams, UserService, $location) {
  $scope.tmpUser = {
    username  : '',
    email     : '',
    firstname : '',
    lastname  : '',
    _id       : ''
  };

  $scope.follow = function(user_id) {
    $scope.$parent.loading = true;
    UserService.followUser(user_id).then(function(response) {
      $scope.$parent.loading = false;
      Materialize.toast(response.message, 1000);
      $scope.following = true;
    });
  };

  $scope.unfollow = function(user_id) {
    $scope.$parent.loading = true;
    UserService.unfollowUser(user_id).then(function(response) {
      $scope.$parent.loading = false;
      Materialize.toast(response.message, 1000);
      $scope.following = false;
    });
  };

  $scope.init = function() {
    var user_id = $routeParams.id;
    if (user_id) {
      $scope.$parent.loading = true;
      UserService.getUser(user_id).then(function(response) {
        $scope.$parent.loading = false;
        if (response.success === false) {
          $location.path('/home');
          return;
        }

        $scope.tmpUser = response.user;
      });
    }
  };

  $scope.init();
}]);
