angular.module('app.hackerNews.IndexCtrl', ['app.hackerNews']).controller('app.hackerNews.IndexCtrl', [
  '$scope', 'HackerNews', function($scope, HackerNews) {
    return HackerNews.query().then(function(res) {
      return $scope.news = res;
    });
  }
]);
