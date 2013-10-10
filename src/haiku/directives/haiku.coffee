angular.module('pl.paprikka.directives.haiku', []).directive('haiku', [
  ->
    templateUrl: 'haiku/partials/haiku.html'
    restrict: 'AE'
    link: ( scope, elm, attrs)->
      elm.append 'hello'
])