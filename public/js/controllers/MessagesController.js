'use strict';

app.controller('MessagesController', ['$scope', 'MessageService', '$timeout', 'MicroFacebookWS', function($scope, MessageService, $timeout) {
  $scope.messages = [];
  $scope.tmpMessage = {content : ''};

  $scope.init = function() {
    MessageService.getAll().then(function(response) {
      $scope.messages = response.messages;
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

  $scope.deleteMessage = function(message_id) {
    MessageService.delete(message_id).then(function(response) {
      Materialize.toast(response.message, 1000);
      if (response.success === false) {
        return ;
      }
      $scope.messages = $scope.messages.filter(function(item) {
        return (item._id !== message_id);
      });
    });
  };

  $scope.init();
}]);
