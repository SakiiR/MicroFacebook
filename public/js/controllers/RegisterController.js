'use strict';

app.controller('RegisterController', ['$scope', 'UserService', '$timeout', '$location', function($scope, UserService, $timeout, $location) {
  $scope.tmpUser = {
    first_name : '',
    last_name  : '',
    email     : '',
    username  : '',
    password  : '',
    password2 : ''
  };

  $scope.submitForm = function() {
    $scope.$parent.loading = true;
    UserService.newUser(
      $scope.tmpUser.first_name,
      $scope.tmpUser.last_name,
      $scope.tmpUser.email,
      $scope.tmpUser.username,
      $scope.tmpUser.password
    ).then(function(response) {
      Materialize.toast(response.message, 500);
      $timeout(function() {
        $scope.$parent.loading = false;
        if (response.success === true) $location.path('/login');
      }, 1000);
    });
  };
}]);
