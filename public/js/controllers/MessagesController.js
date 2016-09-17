'use strict';

app.controller('MessagesController', ['$scope', 'MessageService', '$timeout', function($scope, MessageService, $timeout) {
  $scope.messages = [];
  $scope.tmpMessage = {content : ''};

  $scope.init = function() {
    MessageService.getAll().then(function(response) {
      $scope.messages = response.messages;
    });

    // websocket inc ???
    (function tick() {
      MessageService.getAll().then(function(response) {
        $scope.messages = response.messages;
        $timeout(tick, 1000);
      });
    })();
  };

  $scope.sendMessage = function() {
    MessageService.new($scope.tmpMessage.content).then(function(response) {
      $scope.tmpMessage.content = '';
      if (response.success === false) {
        Materialize.toast(response.message, 1000);
        return;
      }
      $scope.messages.push(response.msg);
    });
  };

  $scope.init();
}]);
