'use strict';

app.controller('LoginController', ['$scope', 'UserService', '$timeout', '$location', 'localStorageService', function($scope, UserService, $timeout, $location, localStorageService) {
  $scope.tmpUser = {
    username : '',
    password : ''
  };

  $scope.submitForm = function() {
    $scope.$parent.loading = true;
    UserService.authUser($scope.tmpUser.username, $scope.tmpUser.password).then(function(response) {
      $scope.$parent.user.token = response.token;
      Materialize.toast(response.message, 500);
      localStorageService.set('token', response.token);
      $timeout(function() {
        $scope.$parent.loading = false;
        $location.path('/home');
      }, 1000);
    });
  };
}]);
