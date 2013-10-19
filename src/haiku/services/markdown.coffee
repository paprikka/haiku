angular.module('pl.paprikka.services.markdown', []).service( 'Markdown', [
  '$window'
  ( $window )-> 
    convert : $window.marked 
    
])