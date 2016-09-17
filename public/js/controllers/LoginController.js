'use strict';

app.controller('LoginController', ['$scope', 'UserService', '$timeout', '$location', 'localStorageService', function($scope, UserService, $timeout, $location, localStorageService) {
  $scope.tmpUser = {
    username : '',
    password : ''
  };

  $scope.submitForm = function() {
    $scope.$parent.loading = true;
    UserService.authUser($scope.tmpUser.username, $scope.tmpUser.password).then(function(response) {
      $scope.$parent.user = response.user;
      $scope.$parent.user.token = response.token;
      Materialize.toast(response.message, 500);
      localStorageService.set('user', response.user);
      $scope.$parent.loading = false;
      $timeout(function() {
        if (response.success === true) $location.path('/home');
      }, 1000);
    });
  };
}]);
