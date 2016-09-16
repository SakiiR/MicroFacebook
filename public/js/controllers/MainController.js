'use strict';

app.controller('MainController', ['$scope', 'localStorageService', function($scope, localStorageService) {
  $scope.loading = false;

  $scope.init = function() {
    var user = localStorageService.get('user');
    if (user !== null) {
      $scope.user = user;
    }
  };

  $scope.user = {
    // Empty User Storage
  };

  $scope.init();

  $scope.Disconnect = function() {
    $scope.user = {  };
    localStorageService.remove('user');
  };

}]);
