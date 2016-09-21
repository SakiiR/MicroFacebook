'use strict';

app.controller('MainController', ['$scope', 'localStorageService', 'PrivateMessageService', function($scope, localStorageService, PrivateMessageService) {
  $scope.loading = false;

  $scope.init = function() {
    var user = localStorageService.get('user');
    if (user !== null) {
      $scope.user = user;
    }
    // Check Mailbow
    PrivateMessageService.countUnreaded().then(function(response) {
      $scope.user.unreadedMessageCount = response.count;
    });
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
