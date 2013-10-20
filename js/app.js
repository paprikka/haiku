'use strict';
/* Controllers*/

var App;

angular.module('app.controllers', []).controller('AppCtrl', [
  '$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
    var setActiveNavId;
    $scope.application = {
      initialized: true
    };
    $scope.$location = $location;
    $scope.activeNavId = '/';
    setActiveNavId = function(path) {
      return $scope.activeNavId = path || '/';
    };
    $scope.$watch('$location.path()', setActiveNavId);
    return $scope.getClass = function(id) {
      var _ref;
      if (((_ref = $scope.activeNavId) != null ? _ref.substring(0, id.length) : void 0) === id) {
        return 'active';
      } else {
        return '';
      }
    };
  }
]).run();

angular.module('app.common.webSockets', []).service('WebSockets', [
  '$window', function($window) {
    return window.io;
  }
]);

angular.module('pl.paprikka.directives.drop', []).directive('ppkDrop', [
  '$window', function($window) {
    return {
      restrict: 'AE',
      templateUrl: 'drop/drop.html',
      replace: true,
      scope: {
        onDrop: '&',
        files: '='
      },
      link: function(scope, elm, attrs) {
        var boxEl, getFileType, getImageFiles, getTextFiles, onDragEnter, onDragLeave, onDragOver, onDrop;
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
          var dt, type, _ref;
          e.stopPropagation();
          e.preventDefault();
          dt = e.dataTransfer;
          scope.$apply(function() {
            scope.files = dt.files;
            return scope.isFileOver = false;
          });
          if ((_ref = dt.files) != null ? _ref[0] : void 0) {
            type = getFileType(dt.files[0]);
            if (type === 'text') {
              getTextFiles(dt.files[0], scope.onDrop);
            }
            if (type === 'images') {
              return getImageFiles(dt.files, scope.onDrop);
            }
          }
        };
        getFileType = function(fileDesc) {
          var ext, regex, _ref;
          regex = /(\.[^.]+)$/i;
          ext = (_ref = fileDesc.name.match(regex)) != null ? _ref[0] : void 0;
          if (fileDesc.type === '') {
            switch (ext) {
              case '.md':
                return 'text';
              case '.txt':
                return 'text';
            }
          } else if (fileDesc.type.split('/')[0] === 'image') {
            return 'images';
          }
        };
        getTextFiles = function(fileRef, cb) {
          var reader;
          reader = new FileReader;
          reader.onload = function(e) {
            var result;
            result = {
              data: e.target.result,
              type: 'text'
            };
            return typeof cb === "function" ? cb({
              file: result
            }) : void 0;
          };
          return reader.readAsText(fileRef);
        };
        getImageFiles = function(fileRefs, cb) {
          var loadSingleImage, reader, result, totalCount;
          reader = new FileReader;
          totalCount = fileRefs.length;
          result = {
            data: [],
            type: 'images'
          };
          loadSingleImage = function() {
            return reader.readAsDataURL(fileRefs[result.data.length]);
          };
          reader.onload = function(e) {
            result.data.push(e.target.result);
            if (result.data.length === totalCount) {
              return typeof cb === "function" ? cb({
                file: result
              }) : void 0;
            } else {
              return loadSingleImage();
            }
          };
          return loadSingleImage();
        };
        Hammer(elm).on('doubletap', function() {
          return elm.find('.ppk-drop__input').click();
        });
        elm.find('.ppk-drop__input').on('change', function(e) {
          return scope.$apply(function() {
            return scope.handleUpload(e.target);
          });
        });
        scope.handleUpload = function(dt) {
          var type, _ref;
          if ((_ref = dt.files) != null ? _ref[0] : void 0) {
            type = getFileType(dt.files[0]);
            if (type === 'text') {
              getTextFiles(dt.files[0], scope.onDrop);
            }
            if (type === 'images') {
              return getImageFiles(dt.files, scope.onDrop);
            }
          }
        };
        scope.supportsUploadClickDelegation = !!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/) && $window.navigator.userAgent.match(/AppleWebKit/);
        boxEl.addEventListener('dragenter', onDragEnter, false);
        boxEl.addEventListener('dragleave', onDragLeave, false);
        boxEl.addEventListener('dragover', onDragOver, false);
        return boxEl.addEventListener('drop', onDrop, false);
      }
    };
  }
]);

angular.module('pl.paprikka.haiku', ['pl.paprikka.directives.haiku', 'pl.paprikka.directives.drop', 'pl.paprikka.haiku.services.remote']);

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

angular.module('pl.paprikka.directives.haiku', ['pl.paprikka.services.haiku.slides', 'pl.paprikka.services.hammerjs', 'pl.paprikka.haiku.services.remote', 'pl.paprikka.directives.haiku.hTap', 'ngSanitize']).directive('haiku', [
  '$window', 'Slides', 'Hammer', 'Remote', '$rootScope', function($window, Slides, Hammer, Remote, $rootScope) {
    return {
      templateUrl: 'haiku/partials/haiku.html',
      restrict: 'AE',
      link: function(scope, elm, attrs) {
        var initSettings, onKeyDown, onMouseWheel;
        scope.categories = Slides.get();
        initSettings = function(scope) {
          scope.currentCategory = 0;
          scope.currentSlide = 0;
          scope.isLastCategory = false;
          scope.isLastSlide = false;
          scope.isFirstCategory = false;
          return scope.isFirstSlide = false;
        };
        initSettings(scope);
        scope.$watch('categories.length', function(n, o) {
          if (n === o) {
            return;
          }
          return initSettings(scope);
        });
        scope.updatePosition = function() {
          var currCat, currSlide, _ref, _ref1;
          console.log("" + scope.currentCategory + " " + scope.currentSlide);
          _.each(scope.categories, function(cat, catIndex) {
            if (catIndex < scope.currentCategory) {
              cat.status = 'prev';
            } else if (catIndex === scope.currentCategory) {
              cat.status = 'current';
            } else if (catIndex > scope.currentCategory) {
              cat.status = 'next';
            }
            console.log(cat.status);
            return _.each(cat.slides, function(slide, slideIndex) {
              if (slideIndex < scope.currentSlide) {
                return slide.status = 'prev';
              } else if (slideIndex === scope.currentSlide) {
                return slide.status = 'current';
              } else if (slideIndex > scope.currentSlide) {
                return slide.status = 'next';
              }
            });
          });
          currCat = scope.currentCategory;
          currSlide = scope.currentSlide;
          scope.isLastCategory = currCat === scope.categories.length - 1 ? true : false;
          scope.isLastSlide = currSlide === ((_ref = scope.categories[currCat]) != null ? (_ref1 = _ref.slides) != null ? _ref1.length : void 0 : void 0) - 1 ? true : false;
          scope.isFirstCategory = currCat === 0 ? true : false;
          scope.isFirstSlide = currSlide === 0 ? true : false;
          return console.log(scope.currentCategory + ' : ' + scope.currentSlide);
        };
        scope.prevCategory = function() {
          if (!scope.isFirstCategory) {
            scope.currentCategory = scope.currentCategory - 1;
            return scope.currentSlide = 0;
          }
        };
        scope.nextCategory = function() {
          if (!scope.isLastCategory) {
            scope.currentCategory = scope.currentCategory + 1;
            return scope.currentSlide = 0;
          }
        };
        scope.prevSlide = function() {
          if (!scope.isFirstSlide) {
            return scope.currentSlide = scope.currentSlide - 1;
          }
        };
        scope.nextSlide = function() {
          if (!scope.isLastSlide) {
            return scope.currentSlide = scope.currentSlide + 1;
          }
        };
        scope.$watch('currentCategory', scope.updatePosition);
        scope.$watch('currentSlide', scope.updatePosition);
        Hammer(elm).on('swipeleft', function(e) {
          e.gesture.srcEvent.preventDefault();
          scope.$apply(scope.nextCategory);
          return false;
        });
        Hammer(elm).on('swiperight', function(e) {
          e.gesture.srcEvent.preventDefault();
          scope.$apply(scope.prevCategory);
          return false;
        });
        Hammer(elm).on('swipeup', function(e) {
          e.gesture.srcEvent.preventDefault();
          scope.$apply(scope.nextSlide);
          return false;
        });
        Hammer(elm).on('swipedown', function(e) {
          e.gesture.srcEvent.preventDefault();
          scope.$apply(scope.prevSlide);
          return false;
        });
        onKeyDown = function(e) {
          if (!scope.$$phase) {
            return scope.$apply(function() {
              switch (e.keyCode) {
                case 37:
                  return scope.prevCategory();
                case 38:
                  return scope.prevSlide();
                case 39:
                  return scope.nextCategory();
                case 40:
                  return scope.nextSlide();
              }
            });
          }
        };
        onMouseWheel = function(e) {
          var delta, treshold;
          delta = e.originalEvent.wheelDelta;
          treshold = 100;
          return scope.$apply(function() {
            if (delta < -treshold) {
              scope.nextSlide();
            }
            if (delta > treshold) {
              return scope.prevSlide();
            }
          });
        };
        $($window).on('keydown', onKeyDown);
        $($window).on('mousewheel', onMouseWheel);
        $rootScope.$on('remote:control', function(e, data) {
          return scope.$apply(function() {
            switch (data.params.direction) {
              case 'up':
                return scope.prevSlide();
              case 'down':
                return scope.nextSlide();
              case 'left':
                return scope.prevCategory();
              case 'right':
                return scope.nextCategory();
            }
          });
        });
        scope.getCategoryClass = function(category) {
          return 'haiku__category--' + (category.status || 'prev');
        };
        scope.getSlideClass = function(slide) {
          return 'haiku__slide--' + (slide.status || 'prev');
        };
        scope.getSlideStyle = function(slide) {
          return {
            'background': slide.background || '#333',
            'background-size': 'cover'
          };
        };
        scope.isCurrentSlide = function(slide) {
          return slide.index === scope.currentSlide && slide.categoryIndex === scope.currentCategory;
        };
        scope.goto = function(slide) {
          scope.currentCategory = slide.categoryIndex;
          return scope.currentSlide = slide.index;
        };
        scope.getThemeClass = function() {
          return 'haiku--default';
        };
        scope.files = [];
        scope.onFileDropped = function(data) {
          return _.defer(function() {
            return scope.$apply(function() {
              scope.categories = Slides.getFromFiles(data);
              return scope.updatePosition();
            });
          });
        };
        Hammer(elm.find('.haiku__close-btn')).on('tap', function(e) {
          return scope.$apply(function() {
            return scope.close();
          });
        });
        scope.close = function() {
          return scope.categories = [];
        };
        return scope.navVisible = true;
      }
    };
  }
]);

angular.module('pl.paprikka.services.hammerjs', []).factory('Hammer', [
  '$window', function($window) {
    return $window.Hammer;
  }
]);

angular.module('pl.paprikka.services.markdown', []).service('Markdown', [
  '$window', function($window) {
    return {
      convert: $window.marked
    };
  }
]);

angular.module('pl.paprikka.haiku.services.remote', ['app.common.webSockets']).service('Remote', [
  'WebSockets', '$rootScope', function(WebSockets, $rootScope) {
    var socket;
    console.log('Remote::init');
    socket = WebSockets.connect('http://haiku-hub.herokuapp.com:80');
    return socket.on('remote', function(data) {
      console.log(data);
      return $rootScope.$emit('remote:control', data);
    });
  }
]);

angular.module('pl.paprikka.services.haiku.slides', ['pl.paprikka.services.markdown']).factory('Slides', [
  'Markdown', function(Markdown) {
    var Slides, defaultColors, indexSlides, markdown, markdownToSlides;
    defaultColors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#95a5a6', '#d35400', '#c0392b', '#7f8c8d'];
    markdown = "";
    indexSlides = function(categories) {
      var indexedCategories;
      indexedCategories = _.cloneDeep(categories);
      _.each(indexedCategories, function(cat, catIndex) {
        return _.each(cat.slides, function(slide, slideIndex) {
          slide.categoryIndex = catIndex;
          slide.index = slideIndex;
          return slide;
        });
      });
      return indexedCategories;
    };
    markdownToSlides = function(md) {
      var categoryBodies, newCategories, slideBody;
      if (!md.length) {
        return [];
      }
      slideBody = Markdown.convert(md);
      categoryBodies = slideBody.split('<hr>');
      _.each(categoryBodies, function(categoryBody) {
        return categoryBody = categoryBody.trim();
      });
      newCategories = [];
      _.each(categoryBodies, function(cat) {
        var newCategory, slidesContents;
        slidesContents = cat.replace(/<h1>/gi, '__PAGE_BREAK__<h1>').split('__PAGE_BREAK__');
        newCategory = {
          slides: []
        };
        _.each(slidesContents, function(sc) {
          var newSlide, parsedMarkdown, regex;
          sc = sc.trim();
          if (sc.length) {
            newSlide = {};
            regex = /<p><img(.*?)src="(.*?)" alt="background"><\/p>/gi;
            parsedMarkdown = sc.replace(regex, function(whole, a, src, c) {
              if (src.indexOf('#') === 0) {
                newSlide.background = src;
              } else {
                newSlide.background = 'url(' + src + ')';
              }
              return '';
            });
            newSlide.body = parsedMarkdown;
            if (!newSlide.background) {
              newSlide.background = defaultColors[Math.floor(Math.random() * defaultColors.length)];
            }
            return newCategory.slides.push(newSlide);
          }
        });
        return newCategories.push(newCategory);
      });
      return newCategories;
    };
    Slides = function() {};
    Slides.get = function() {
      return indexSlides(markdownToSlides(markdown));
    };
    Slides.getFromFiles = function(files) {
      if (files.type === 'text') {
        return Slides.getFromMarkdown(files.data);
      } else if (files.type === 'images') {
        return Slides.getFromImages(files.data);
      } else {
        return [];
      }
    };
    Slides.getFromMarkdown = function(markdown) {
      return indexSlides(markdownToSlides(markdown));
    };
    Slides.getFromImages = function(images) {
      var categories;
      categories = [
        {
          slides: []
        }
      ];
      _.each(images, function(img) {
        var slide;
        slide = {
          background: 'url(' + img + ')'
        };
        return categories[0].slides.push(slide);
      });
      return indexSlides(categories);
    };
    return Slides;
  }
]);

'use strict';

App = angular.module('app', ['templates', 'ngCookies', 'ngResource', 'app.controllers', 'pl.paprikka.haiku']);

App.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/404', {
      templateUrl: 'pages/404.html'
    }).when('/', {
      templateUrl: 'pages/partials/intro.html'
    }).otherwise({
      redirectTo: '/404'
    });
    return $locationProvider.html5Mode(false);
  }
]).run();

/*
//@ sourceMappingURL=app.js.map
*/