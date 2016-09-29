'use strict';

app.controller('MailboxController', ['$scope', 'UserService', 'PrivateMessageService', function($scope, UserService, PrivateMessageService) {
  $scope.init = function() {
    $(".button-collapse").sideNav();
    $('input#input_text, textarea#textarea1').characterCounter();
    UserService.getAll().then(function(response) {
      var userArray = {};
      $scope.users = response.users;
      angular.forEach(response.users, function(item) {
        userArray[item.username] = null; // Add Avatar Later ?
      });
      $('input.autocomplete').autocomplete({
        data : userArray
      });
    });
    PrivateMessageService.getAllConcerned().then(function (response) {
      $scope.privateMessages = response.messages;
      angular.forEach($scope.privateMessages, function (item) { // Convert to moment
        item.created = moment.unix(item.created / 1000).startOf('hours').fromNow();
      });
    });
  };

  $scope.users = [];
  $scope.destination = '';
  $scope.content = '';
  $scope.privateMessages = [];

  $scope.getIdByUsername = function(username) {
    var id = null;
    angular.forEach($scope.users, function(user) {
      if (user.username === username) {
        id = user._id;
        return;
      }
    });
    return id;
  };

  $scope.sendMessage = function() {
    var id = $scope.getIdByUsername($scope.destination);
    if (id === null) return Materialize.toast('Failed to find user "' + $scope.destination + '" !', 1000);
    PrivateMessageService.new($scope.content, $scope.destination).then(function(response) {
      if (response.success === false) return Materialize.toast(response.message, 1000);
      $scope.privateMessages.push(response.msg);
      $scope.content = '';
      $scope.destination = '';
      return Materialize.toast(response.message, 1000);
    });
  };

  $scope.init();
}]);
