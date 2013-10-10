angular.module('app.hacker-news', []).controller('hackerNewsIndexCtrl', [
  '$scope', function($scope) {
    return $scope.news = 'hello';
  }
]);
