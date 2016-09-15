'use strict';

app.controller('RegisterController', ['$scope', function($scope) {
  $scope.tmpUser = {
    firstname : '',
    lastname  : '',
    email     : '',
    username  : '',
    password  : '',
    password2 : ''
  };

  $scope.submitForm = function() {
    // Use Resource or $http ?
    console.log('submitting form !');
  };
}]);
