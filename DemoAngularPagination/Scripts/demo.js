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
                $scope.totalCount = value.TotalCount;
                $scope.Data = value;
                $scope.isSearching = false;
            };
            var _onError = function () {
                $scope.isSearching = false;
            };

            $scope.isSearching = true;

            Product.query({ page: page, pageSize: 8 },
                _onSuccess,
                _onError);
        };

        $scope.search();
    }]
);


/*************************************************************************/
// DIRECTIVES

demoApp.directive('demoPager', function () {
    return {
        scope: {
            page: '@',
            pagesCount: '@',
            totalCount: '@',
            searchFunc: '&'
        },
        replace: true,
        restrict: 'E',
        templateUrl: 'scripts/templates/pager-template.html',
        controller: ['$scope', function ($scope) {
            $scope.search = function (i) {
                if ($scope.searchFunc) {
                    $scope.searchFunc({ page: i });
                }
            };

            $scope.range = function () {
                if (!$scope.pagesCount) { return []; }
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
