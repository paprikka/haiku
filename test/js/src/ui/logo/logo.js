angular.module('app.ui.logo', []).directive('appLogo', function() {
  return {
    restrict: 'AE',
    templateUrl: 'ui/logo/logo.html',
    link: function(scope, elm, attr) {}
  };
});
