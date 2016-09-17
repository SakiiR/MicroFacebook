'use strict';

app.controller('MessagesController', ['$scope', 'MessageService', '$timeout', function($scope, MessageService, $timeout) {
  $scope.messages = [];
  $scope.tmpMessage = {content : ''};

  $scope.init = function() {
    MessageService.getAll().then(function(response) {
      $scope.messages = response.messages;
    });
    socket.on('new_message', function(message) {
      $scope.messages.push(message);
    });
  };

  $scope.sendMessage = function() {
    MessageService.new($scope.tmpMessage.content).then(function(response) {
      $scope.tmpMessage.content = '';
      if (response.success === false) {
        Materialize.toast(response.message, 1000);
        return;
      }
      socket.emit('new_message', response.msg);
    });
  };

  $scope.init();
}]);
