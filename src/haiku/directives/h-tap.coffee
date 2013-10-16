angular.module('pl.paprikka.directives.haiku.hTap', []).directive('hTap', [
  -> 
    link: (scope, elm, attrs) ->
      if Modernizr.touch
        tapping = false
        elm.on 'touchstart', -> tapping = true
        elm.on 'touchmove', -> tapping = false
        elm.on 'touchend', -> scope.$apply(attrs['hTap']) if tapping
      else
        elm.on 'click',  -> scope.$apply(attrs['hTap']) 
])