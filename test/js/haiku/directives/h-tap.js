angular.module('pl.paprikka.directives.haiku.hTap', []).directive('hTap', [
  function() {
    return {
      link: function(scope, elm, attrs) {
        var tapping;
        if (Modernizr.touch) {
          tapping = false;
          elm.on('touchstart', function() {
            return tapping = true;
          });
          elm.on('touchmove', function() {
            return tapping = false;
          });
          return elm.on('touchend', function() {
            if (tapping) {
              return scope.$apply(attrs['hTap']);
            }
          });
        } else {
          return elm.on('click', function() {
            return scope.$apply(attrs['hTap']);
          });
        }
      }
    };
  }
]);
