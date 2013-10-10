angular.module('pl.paprikka.canvas.editor', ['pl.paprikka.canvas.thumbnailer']).directive('ppkCanvasEditor', [
  'Thumbnailer', '$timeout', function(Thumbnailer, $timeout) {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'canvas/directives/partials/editor.html',
      link: function(scope, elm, attrs) {
        var $body, $canvas, $imgInput, $previewImg, canvas, ctx, makeSnapshot, previewImg, readURL;
        scope.files = [];
        $previewImg = $(elm.find('.ppk-canvas__image'));
        $imgInput = $(elm.find('.ppk-canvas__input'));
        previewImg = $previewImg[0];
        $canvas = $(elm.find('.ppk-canvas__editor'));
        canvas = $canvas[0];
        ctx = canvas.getContext('2d');
        $imgInput.change(function() {
          return readURL(this);
        });
        $previewImg.on('load', function() {
          var h, ratio, w;
          w = canvas.width;
          h = canvas.height;
          ratio = previewImg.height / previewImg.width;
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(previewImg, 0, 0, w, ratio * w);
          $canvas.hide();
          return $timeout((function() {
            return $canvas.show();
          }), 1);
        });
        $body = $('body');
        makeSnapshot = function() {
          var h, newScale, p, ratio, sHeight, sWidth, scale, sx, sy, w;
          console.log(scope.position);
          w = canvas.width;
          h = canvas.height;
          ratio = previewImg.height / previewImg.width;
          ctx.clearRect(0, 0, w, h);
          scale = canvas.width / previewImg.width;
          p = scope.position;
          sx = p.left / scale;
          sy = p.top / scale;
          sWidth = p.width / scale;
          sHeight = p.height / scale;
          ratio = sHeight / sWidth;
          newScale = w / sWidth;
          ctx.drawImage(previewImg, sx, sy, sWidth, sHeight, 0, 0, sWidth * newScale, sHeight * newScale);
          return $previewImg.attr('src', canvas.toDataURL('image/gif'));
        };
        $body.on('keyup', function(e) {
          if (e.keyCode === 13) {
            makeSnapshot();
          }
          e.preventDefault();
          e.stopImmediatePropagation();
          return e.stopPropagation();
        });
        scope.handleFiles = function() {
          var reader, _ref;
          if ((_ref = scope.files) != null ? _ref[0] : void 0) {
            reader = new FileReader;
            reader.onload = function(e) {
              return $previewImg.attr('src', e.target.result);
            };
            return reader.readAsDataURL(scope.files[0]);
          }
        };
        readURL = function(input) {
          var reader, _ref;
          if ((_ref = input.files) != null ? _ref[0] : void 0) {
            reader = new FileReader;
            reader.onload = function(e) {
              return $previewImg.attr('src', e.target.result);
            };
            return reader.readAsDataURL(input.files[0]);
          }
        };
        scope.download = function() {
          return window.open($previewImg.attr('src'));
        };
        return scope.clear = function() {
          scope.files = [];
          return $canvas.focus();
        };
      }
    };
  }
]);
