'use strict';

app.controller('LoginController', ['$scope', function($scope) {
  $scope.tmpUser = {
    username : '',
    password : ''
  };

  $scope.submitForm = function() {
    // Use Resource or $http ?
    console.log('submitting form !');
  };
}]);
