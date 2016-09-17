'use strict';

app.controller('MessagesController', ['$scope', 'MessageService', function($scope, MessageService) {
  $scope.messages = [];
  $scope.tmpMessage = {content : ''};
  $scope.init = function() {
    MessageService.getAll().then(function(response) {
      $scope.messages = response.messages;
    });
  };

  $scope.sendMessage = function() {
    MessageService.new($scope.tmpMessage.content).then(function(response) {
      if (response.success === false) {
        Materialize.toast(response.message, 1000);
        return;
      }
    });
  };

  $scope.init();
}]);
