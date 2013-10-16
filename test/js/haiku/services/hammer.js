angular.module('pl.paprikka.services.hammerjs', []).factory('Hammer', [
  '$window', function($window) {
    return $window.Hammer;
  }
]);
