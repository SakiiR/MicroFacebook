'use strict';

app.controller('RegisterController', ['$scope', 'UserService', '$timeout', '$location', function($scope, UserService, $timeout, $location) {
  $scope.tmpUser = {
    firstname : '',
    lastname  : '',
    email     : '',
    username  : '',
    password  : '',
    password2 : ''
  };

  $scope.submitForm = function() {
    $scope.$parent.loading = true;
    UserService.newUser(
      $scope.tmpUser.firstname,
      $scope.tmpUser.lastname,
      $scope.tmpUser.email,
      $scope.tmpUser.username,
      $scope.tmpUser.password
    ).then(function(response) {
      Materialize.toast(response.message, 50000);
      $timeout(function() {
        $scope.$parent.loading = false;
        // $location.path('/login');
      }, 1000);
    });
  };
}]);
