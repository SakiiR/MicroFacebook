'use strict';

app.controller('MessagesController', ['$scope', 'MessageService', function($scope, MessageService) {
  $scope.messages = [];

  $scope.init = function() {
    MessageService.getAll().then(function(response) {
      console.log(response);
    });
  };

  $scope.init();
}]);
