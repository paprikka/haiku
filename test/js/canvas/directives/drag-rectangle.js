angular.module('pl.paprikka.canvas.dragRectangle', []).directive('ppkDragRectangle', [
  function() {
    return {
      replace: true,
      restrict: 'AE',
      templateUrl: 'canvas/directives/drag-rectangle.html',
      scope: {
        coords: '=position'
      },
      link: function(scope, elm, attrs) {
        var $body, $parent, getCoords, onMouseDown, onMouseMove, onMouseUp, onRectangleMouseDown, onRectangleMouseMove, onRectangleMouseUp, startDrag, startDragRectangle, stopDrag, stopDragRectangle;
        $parent = elm.parent();
        $body = $(document);
        scope.state = '';
        scope.coords = {};
        getCoords = function() {
          var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
          scope.coords.left = (_ref = scope.position) != null ? _ref.startX : void 0;
          scope.coords.top = (_ref1 = scope.position) != null ? _ref1.startY : void 0;
          scope.coords.width = Math.max(((_ref2 = scope.position) != null ? _ref2.endX : void 0) - ((_ref3 = scope.position) != null ? _ref3.startX : void 0), 1);
          return scope.coords.height = Math.max(((_ref4 = scope.position) != null ? _ref4.endY : void 0) - ((_ref5 = scope.position) != null ? _ref5.startY : void 0), 1);
        };
        scope.$watch('position', getCoords, true);
        scope.initialPosition = {
          x: 0,
          y: 0
        };
        scope.position = {
          startX: 0,
          startY: 0,
          endX: 0,
          endY: 0
        };
        onMouseDown = function(e) {
          if (e.target !== this) {
            return;
          }
          e.preventDefault();
          e.stopImmediatePropagation();
          scope.$apply(function() {
            scope.position.startX = e.offsetX;
            scope.position.startY = e.offsetY;
            scope.position.endX = e.offsetX;
            return scope.position.endY = e.offsetY;
          });
          return startDrag();
        };
        onMouseUp = function(e) {
          return stopDrag();
        };
        onMouseMove = function(e) {
          scope.$apply(function() {
            scope.position.endX = e.offsetX;
            return scope.position.endY = e.offsetY;
          });
          e.preventDefault();
          return e.stopImmediatePropagation();
        };
        startDrag = function(e) {
          scope.$apply(function() {
            return scope.state = 'scaling';
          });
          $parent.on('mousemove', onMouseMove);
          return $body.on('mouseup', onMouseUp);
        };
        stopDrag = function(e) {
          scope.$apply(function() {
            return scope.state = '';
          });
          $parent.off('mousemove', onMouseMove);
          return $body.off('mouseup', onMouseUp);
        };
        $parent.on('mousedown', onMouseDown);
        onRectangleMouseDown = function(e) {
          if (this !== e.target) {
            return;
          }
          scope.initialPosition.x = e.clientX;
          scope.initialPosition.y = e.clientY;
          startDragRectangle();
          e.preventDefault();
          return e.stopImmediatePropagation();
        };
        onRectangleMouseUp = function(e) {
          stopDragRectangle();
          e.preventDefault();
          return e.stopImmediatePropagation();
        };
        onRectangleMouseMove = function(e) {
          var offsetX, offsetY;
          offsetX = e.clientX - scope.initialPosition.x;
          offsetY = e.clientY - scope.initialPosition.y;
          scope.$apply(function() {
            scope.position.startX = scope.position.startX + offsetX;
            scope.position.startY = scope.position.startY + offsetY;
            scope.position.endX = scope.position.endX + offsetX;
            return scope.position.endY = scope.position.endY + offsetY;
          });
          scope.initialPosition.x = e.clientX;
          return scope.initialPosition.y = e.clientY;
        };
        startDragRectangle = function() {
          return elm.on('mousemove', onRectangleMouseMove);
        };
        stopDragRectangle = function() {
          return elm.off('mousemove', onRectangleMouseMove);
        };
        elm.on('mousedown', onRectangleMouseDown);
        return elm.on('mouseup', onRectangleMouseUp);
      }
    };
  }
]);
