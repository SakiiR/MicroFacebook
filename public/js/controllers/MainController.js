'use strict';

app.controller('MainController', ['$scope', 'localStorageService', 'PrivateMessageService', 'MicroFacebookWS',
  function($scope, localStorageService, PrivateMessageService, MicroFacebookWS) {
  $scope.loading = false;

  $scope.init = function() {
    var user = localStorageService.get('user');
    if (user !== null) {
      $scope.user = user;
      MicroFacebookWS.emit('authenticate', {token : user.token})
          .on('authenticated', function() {
            Materialize.toast('connected to socketio!', 1000);
          })
          .on('unauthorized', function() {
            Materialize.toast('socketio error', 1000);
          });
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

  $scope.saveUser = function () {
    localStorageService.set('user', $scope.user);
  };
}]);
