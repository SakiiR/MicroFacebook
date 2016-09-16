'use strict';

app.controller('ProfileController', ['$scope', '$routeParams', 'UserService', '$location', function($scope, $routeParams, UserService, $location) {
  $scope.tmpUser = {
    username  : '',
    email     : '',
    firstname : '',
    lastname  : '',
    _id       : ''
  };

  $scope.init = function() {
    var user_id = $routeParams.id;

    if (user_id) {
      $scope.$parent.loading = true;
      UserService.getUser(user_id).then(function(response) {
        $scope.$parent.loading = false;
        if (response.success === false) {
          $location.path('/home');
          return;
        }

        $scope.tmpUser = response.user;
      });
    }
  };

  $scope.init();
}]);
