'use strict';

app.controller('ProfileController', ['$scope', '$routeParams', 'UserService', '$location', function($scope, $routeParams, UserService, $location) {
  $scope.tmpUser = {
    username  : '',
    email     : '',
    firstname : '',
    lastname  : '',
    _id       : '',
    followers : []
  };

  $scope.follow = function(user_id) {
    $scope.$parent.loading = true;
    UserService.followUser(user_id).then(function(response) {
      $scope.$parent.loading = false;
      Materialize.toast(response.message, 1000);
      $scope.following = true;
      $scope.tmpUser.followers.push($scope.$parent.user);
    });
  };

  $scope.unfollow = function(user_id) {
    $scope.$parent.loading = true;
    UserService.unfollowUser(user_id).then(function(response) {
      $scope.$parent.loading = false;
      Materialize.toast(response.message, 1000);
      $scope.following = false;
      $scope.tmpUser.followers.splice($scope.tmpUser.followers.indexOf($scope.$parent.user), 1);
    });
  };

  $scope.init = function() {
    var user_id = $routeParams.id;
    if (user_id) {
      $scope.$parent.loading = true;
      UserService.getUser(user_id).then(function(response) {
        $scope.tmpUser = response.user;
        angular.forEach($scope.tmpUser.followers, function(item) {
          if (item._id === $scope.$parent.user._id) {
            $scope.following = true;
          }
        });
        $scope.$parent.loading = false;
        if (response.success === false) {
          $location.path('/home');
          return;
        }
      });
    }
  };

  $scope.init();
}]);
