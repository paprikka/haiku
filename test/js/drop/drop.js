angular.module('pl.paprikka.drop', []).directive('ppkDrop', [
  function() {
    return {
      restrict: 'AE',
      templateUrl: 'drop/drop.html',
      replace: true,
      scope: {
        onDrop: '&',
        files: '='
      },
      link: function(scope, elm, attrs) {
        var boxEl, onDragEnter, onDragOver, onDrop;
        boxEl = elm.find('.ppk-drop__box')[0];
        scope.isFileOver = false;
        onDragEnter = function(e) {
          e.stopPropagation();
          e.preventDefault();
          return scope.$apply(function() {
            return scope.isFileOver = true;
          });
        };
        onDragOver = function(e) {
          e.stopPropagation();
          e.preventDefault();
          return scope.$apply(function() {
            return scope.isFileOver = false;
          });
        };
        onDrop = function(e) {
          var dt;
          e.stopPropagation();
          e.preventDefault();
          dt = e.dataTransfer;
          scope.$apply(function() {
            return scope.files = dt.files;
          });
          return typeof scope.onDrop === "function" ? scope.onDrop() : void 0;
        };
        boxEl.addEventListener('dragenter', onDragEnter, false);
        boxEl.addEventListener('dragover', onDragOver, false);
        return boxEl.addEventListener('drop', onDrop, false);
      }
    };
  }
]);
