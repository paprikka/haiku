angular.module('pl.paprikka.directives.drop', [])
.directive('ppkDrop', [
  ->
    restrict:     'AE'
    templateUrl:  'drop/drop.html'
    replace:      yes
    scope:
      onDrop: '&'
      files: '='
    link: (scope, elm, attrs)->
      boxEl = elm.find('.ppk-drop__box')[0]

      scope.isFileOver = no

      onDragEnter = (e) ->
        # e.stopPropagation()
        # e.preventDefault()
        scope.$apply ->
          scope.isFileOver = yes
      
      onDragLeave = (e) ->
        # e.stopPropagation()
        # e.preventDefault()
        scope.$apply ->
          scope.isFileOver = no
        
      onDragOver = (e) ->
        e.preventDefault()
      
      
      
      
      onDrop = (e) ->
        e.stopPropagation()
        e.preventDefault()
        dt = e.dataTransfer
        scope.$apply -> scope.files = dt.files

        if dt.files?[0]
          reader = new FileReader

          reader.onload = (e)->
            scope.onDrop? markdownContent : e.target.result
            
          reader.readAsText scope.files[0]
  


        

      



      boxEl.addEventListener 'dragenter', onDragEnter, off
      boxEl.addEventListener 'dragleave', onDragLeave, off
      boxEl.addEventListener 'dragover', onDragOver, off
      boxEl.addEventListener 'drop', onDrop, off



])