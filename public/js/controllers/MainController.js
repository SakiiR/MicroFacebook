'use strict';

app.controller('MainController', ['$scope', 'localStorageService', 'PrivateMessageService', 'MicroFacebookWS', function($scope, localStorageService, PrivateMessageService, MicroFacebookWS) {
  $scope.loading = false;

  $scope.init = function() {
    var user = localStorageService.get('user');
    if (user !== null) {
      $scope.user = user;
    }
    // Check Mailbox
    PrivateMessageService.countUnreaded().then(function(response) {
      $scope.user.unreadedMessageCount = response.count;
    });

    console.log(MicroFacebookWS);
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
