var demoApp = angular.module('demoApp', ['ngResource']);

/*************************************************************************/
// RESOURCES

demoApp.factory('Product', ['$resource',
  function ($resource) {
      return $resource('', {}, {
          query: {
              method: 'GET',
              url: '/api/products'
          }
      });
  }]);


/*************************************************************************/
// DIRECTIVES

demoApp.directive('demoPager', function () {
    return {
        restrict: 'E',
        templateUrl: 'scripts/templates/pager-template.html',
        controller: ['$scope', function ($scope) {
            $scope.range = function () {
                var step = 2;
                var doubleStep = step * 2;
                var start = Math.max(0, $scope.page - step);
                var end = start + 1 + doubleStep;
                if (end > $scope.pagesCount) { end = $scope.pagesCount; }

                var ret = [];
                for (var i = start; i != end; ++i) {
                    ret.push(i);
                }

                return ret;
            };
        }]
    }
});

/*************************************************************************/
// CONTROLLERS

demoApp.controller('ProductsArchiveCtrl', ['$scope', 'Product',
    function ($scope, Product) {
        $scope.isSearching = false;

        $scope.page = 0;
        $scope.pagesCount = 0;

        $scope.search = function (page) {
            page = page || 0;

            var _onSuccess = function (value) {
                $scope.page = value.Page;
                $scope.pagesCount = value.TotalPages;
                $scope.Data = value;
                $scope.isSearching = false;
            };
            var _onError = function () {
                $scope.isSearching = false;
            };

            $scope.isSearching = true;

            Product.query({ page: page, pageSize: 10 },
                _onSuccess,
                _onError);
        };

        $scope.search();
    }]
);
