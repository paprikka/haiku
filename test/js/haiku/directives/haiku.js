angular.module('pl.paprikka.directives.haiku', ['pl.paprikka.services.haiku.slides', 'pl.paprikka.services.hammerjs', 'pl.paprikka.directives.haiku.hTap']).directive('haiku', [
  '$window', 'Slides', 'Hammer', function($window, Slides) {
    return {
      templateUrl: 'haiku/partials/haiku.html',
      restrict: 'AE',
      link: function(scope, elm, attrs) {
        var onKeyDown;
        scope.categories = Slides.get();
        scope.currentCategory = 0;
        scope.currentSlide = 0;
        scope.isLastCategory = false;
        scope.isLastSlide = false;
        scope.isFirstCategory = false;
        scope.isFirstSlide = false;
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
        Hammer(elm).on('swipeleft', function() {
          return scope.$apply(scope.nextCategory);
        });
        Hammer(elm).on('swiperight', function() {
          return scope.$apply(scope.prevCategory);
        });
        Hammer(elm).on('swipeup', function() {
          return scope.$apply(scope.nextSlide);
        });
        Hammer(elm).on('swipedown', function() {
          return scope.$apply(scope.prevSlide);
        });
        onKeyDown = function(e) {
          if (!scope.$$phase) {
            scope.$apply(function() {
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
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        };
        $($window).on('keydown', onKeyDown);
        scope.getCategoryClass = function(category) {
          return 'haiku__category--' + (category.status || 'prev');
        };
        scope.getSlideClass = function(slide) {
          return 'haiku__slide--' + (slide.status || 'prev');
        };
        scope.getSlideStyle = function(slide) {
          return {
            'background-color': slide.background || '#333'
          };
        };
        scope.isCurrentSlide = function(slide) {
          return slide.index === scope.currentSlide && slide.categoryIndex === scope.currentCategory;
        };
        return scope.goto = function(slide) {
          scope.currentCategory = slide.categoryIndex;
          return scope.currentSlide = slide.index;
        };
      }
    };
  }
]);
