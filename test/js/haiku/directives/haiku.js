angular.module('pl.paprikka.directives.haiku', []).directive('haiku', [
  function() {
    return {
      templateUrl: 'haiku/partials/haiku.html',
      restrict: 'AE',
      link: function(scope, elm, attrs) {
        return elm.append('hello');
      }
    };
  }
]);
