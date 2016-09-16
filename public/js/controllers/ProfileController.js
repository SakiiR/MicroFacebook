'use strict';

app.controller('ProfileController', ['$scope', '$routeParams', 'UserService', function($scope, $routeParams, UserService) {
  $scope.init = function() {
    var user_id = $routeParams.id;

    if (user_id) {
      $scope.$parent.loading = true;
      UserService.getUser(user_id).then(function(response) {
        $scope.$parent.loading = false;
        console.log(response)
      });
    }
  };

  $scope.init();
}]);
