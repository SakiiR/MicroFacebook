'use strict';

app.controller('MembersController', ['$scope', 'UserService', function($scope, UserService) {
  $scope.users = [];

  $scope.init = function() {
    UserService.getAll().then(function(response) {
      if (response.success == false) {
        return Materialize.toast(response.message, 1000);
      }
      $scope.users = response.users;
    });
  };

  $scope.init();
}]);
