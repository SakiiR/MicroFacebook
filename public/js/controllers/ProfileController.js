'use strict';

app.controller('ProfileController', ['$scope', '$routeParams', 'UserService', '$location', function($scope, $routeParams, UserService, $location) {
  $scope.tmpUser = {
    username     : '',
    email        : '',
    first_name   : '',
    last_name    : '',
    _id          : '',
    followers    : [],
    messageCount : 0,
    friends_list : []
  };

  $scope.init = function() {
    var user_id = $routeParams.id;
    if (user_id) {
      $scope.$parent.loading = true;
      UserService.getUser(user_id).then(function(response) {
        $scope.$parent.loading = false;
        $scope.tmpUser = response.user;
        angular.forEach($scope.tmpUser.followers, function(item) {
          if (item._id === $scope.$parent.user._id) {
            $scope.following = true;
          }
        });
        if (response.success === false) {
          $location.path('/home');
        }
      });
    }
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

  $scope.add_friend = function(user_id) {
    $scope.$parent.loading = true;
    UserService.addFriend(user_id).then(function(response) {
      $scope.$parent.loading = false;
      Materialize.toast(response.message, 1000);
      if (response.success === false) return;
      $scope.$parent.user.friends_list = response.me.friends_list;
      $scope.$parent.saveUser();
    });
  };

  $scope.remove_friend = function(user_id) {
    $scope.$parent.loading = true;
    UserService.removeFriend(user_id).then(function(response) {
      $scope.$parent.loading = false;
      Materialize.toast(response.message, 1000);
      if (response.success === false) return;
      $scope.$parent.user.friends_list = response.me.friends_list;
      $scope.$parent.saveUser();
    });
  };

  $scope.is_friend = function(me, friend) {
    if (me.friends_list.indexOf(friend._id) > -1) {
      if (friend.friends_list.indexOf(me._id) > -1) {
        return 1;
      } else {
        return 0;
      }
    }
    return -1;
  };

  $scope.init();
}]);
