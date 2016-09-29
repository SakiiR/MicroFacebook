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
  };

  MicroFacebookWS.forward('updated_message', $scope);
  $scope.$on('socket:updated_message', function() {
    Materialize.toast('New Message !', 1000);
  });

  $scope.user = {
    // Empty User Storage
  };

  $scope.init();

  $scope.Disconnect = function() {
    $scope.user = {  };
    localStorageService.remove('user');
  };

}]);
