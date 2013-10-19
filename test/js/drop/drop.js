angular.module('pl.paprikka.directives.drop', []).directive('ppkDrop', [
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
        var boxEl, onDragEnter, onDragLeave, onDragOver, onDrop;
        boxEl = elm.find('.ppk-drop__box')[0];
        scope.isFileOver = false;
        onDragEnter = function(e) {
          return scope.$apply(function() {
            return scope.isFileOver = true;
          });
        };
        onDragLeave = function(e) {
          return scope.$apply(function() {
            return scope.isFileOver = false;
          });
        };
        onDragOver = function(e) {
          return e.preventDefault();
        };
        onDrop = function(e) {
          var dt, reader, _ref;
          e.stopPropagation();
          e.preventDefault();
          dt = e.dataTransfer;
          scope.$apply(function() {
            return scope.files = dt.files;
          });
          if ((_ref = dt.files) != null ? _ref[0] : void 0) {
            reader = new FileReader;
            reader.onload = function(e) {
              return typeof scope.onDrop === "function" ? scope.onDrop({
                markdownContent: e.target.result
              }) : void 0;
            };
            return reader.readAsText(scope.files[0]);
          }
        };
        boxEl.addEventListener('dragenter', onDragEnter, false);
        boxEl.addEventListener('dragleave', onDragLeave, false);
        boxEl.addEventListener('dragover', onDragOver, false);
        return boxEl.addEventListener('drop', onDrop, false);
      }
    };
  }
]);
