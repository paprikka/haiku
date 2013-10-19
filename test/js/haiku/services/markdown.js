angular.module('pl.paprikka.services.markdown', []).service('Markdown', [
  '$window', function($window) {
    return {
      convert: $window.marked
    };
  }
]);
