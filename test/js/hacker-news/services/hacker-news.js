angular.module('app.hackerNews.HackerNews', []).factory('HackerNews', [
  '$http', '$q', function($http, $q) {
    var HackerNews;
    HackerNews = (function() {
      var BASE_URL;

      function HackerNews() {}

      BASE_URL = 'http://api.ihackernews.com/page?format=jsonp&callback=JSON_CALLBACK ';

      HackerNews.prototype.query = function() {
        var deferred, onError, onSuccess;
        deferred = $q.defer();
        onSuccess = function(data, status) {
          return deferred.resolve(data.items);
        };
        onError = function(data, status) {
          return deferred.reject(data);
        };
        $http.jsonp(BASE_URL).success(onSuccess).error(onError);
        return deferred.promise;
      };

      return HackerNews;

    })();
    return new HackerNews;
  }
]);
