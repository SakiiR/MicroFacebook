'use strict';

app.controller('ProfileEditController', ['$scope', 'UserService', 'localStorageService', function($scope, UserService, localStorageService) {
    $scope.avatar = null;

    $scope.init = function() {

    };

    $scope.updateAvatar = function() {
        UserService.setAvatar($scope.avatar[0]).then(function(response) {
            if (response.success === false) return Materialize.toast(response.message, 1000);
            $scope.$parent.user.avatar = response.avatarUrl;
            localStorageService.set('user', $scope.$parent.user);
        });
    };

    $scope.init();
}]);
