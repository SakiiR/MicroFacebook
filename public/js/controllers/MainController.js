'use strict';

app.controller('MainController', ['$scope', 'localStorageService', function($scope, localStorageService) {
  $scope.loading = false;

  $scope.init = function() {
    var token = localStorageService.get('token');
    if (token !== null) {
      $scope.user.token = token;
    }
  };

  $scope.user = {
    token : undefined
  };

  $scope.init();

  $scope.Disconnect = function() {
    $scope.user.token = undefined;
    localStorageService.remove('token');
  };

}]);
