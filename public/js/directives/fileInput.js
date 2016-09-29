'use strict';

app.directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            element.bind('change', function () {
                $parse(attributes.fileInput)
                    .assign(scope,element[0].files);
                scope.$apply();
            });
        }
    };
}]);
