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
        return scope.onFileDropped = function(markdownContent) {
          return _.defer(function() {
            return scope.$apply(function() {
              scope.categories = Slides.getFromMarkdown(markdownContent);
              return scope.updatePosition();
            });
          });
        };
      }
    };
  }
]);
