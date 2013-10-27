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

angular.module("app.common.services.Modal", ['ui.bootstrap', 'ui.bootstrap.tpls']).service('Modal', [
  '$modal', function($modal) {
    window.m = $modal;
    return $modal;
  }
]).service('ModalDefaults', function() {
  var settings;
  return settings = {
    buttons: {
      yesNo: [
        {
          label: 'No',
          result: false,
          cssClass: 'btn--default'
        }, {
          label: 'Yes',
          result: true,
          cssClass: 'btn--positive'
        }
      ]
    }
  };
});

angular.module('app.common.services.Notify', []).factory('Notify', function() {
  toastr.options.positionClass = 'toast-bottom-right';
  toastr.options.hideDuration = 2;
  return window.toastr;
});

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

angular.module('pl.paprikka.haiku', ['ngSanitize', 'pl.paprikka.directives.haiku', 'pl.paprikka.directives.drop', 'pl.paprikka.haiku.directives.nav', 'pl.paprikka.directives.haiku.hTap', 'pl.paprikka.services.hammerjs', 'pl.paprikka.haiku.services.remote', 'pl.paprikka.haiku.services.slides', 'pl.paprikka.haiku.controllers.import', 'pl.paprikka.haiku.controllers.play', 'pl.paprikka.haiku.controllers.view']);

angular.module('pl.paprikka.haiku.controllers.import', ['pl.paprikka.haiku.services.importer', 'app.common.services.Notify']).controller('HaikuImportCtrl', [
  'Importer', '$location', '$rootScope', '$scope', 'Remote', 'Modal', 'Notify', function(Importer, $location, $rootScope, $scope, Remote, Modal, Notify) {
    $rootScope.categories = [];
    $scope.files = [];
    $rootScope.$on('haiku:room:accepted', function(e, data) {
      $rootScope.clientRole = 'host';
      $location.path('/play/' + data.room);
      return $scope.$apply();
    });
    $scope.initConnection = function(categories) {
      return Remote.request(categories);
    };
    return $scope.onFileDropped = function(data) {
      return _.defer(function() {
        return $scope.$apply(function() {
          $rootScope.categories = Importer.getFromFiles(data);
          if ($rootScope.categories.length) {
            $scope.initConnection($rootScope.categories);
          }
          return console.log('Categories loaded: ', $scope.categories);
        });
      });
    };
  }
]);

angular.module('pl.paprikka.haiku.controllers.play', ['app.common.services.Modal']).controller('HaikuPlayCtrl', [
  '$location', '$routeParams', '$rootScope', '$scope', 'Remote', 'Modal', 'Notify', function($location, $routeParams, $rootScope, $scope, Remote, Modal, Notify) {
    var sendCtrl, shareCtrl, _ref;
    $rootScope.$on('haiku:remote:URLShared', function() {
      return Notify.info('Invitations sent.');
    });
    $rootScope.$on('haiku:remote:URLSent', function() {
      return Notify.info('Remote bookmark sent.');
    });
    $rootScope.$on('haiku:room:remoteJoined', function() {
      return Notify.info('Remote connected.');
    });
    $rootScope.$on('haiku:room:guestJoined', function() {
      return Notify.info('Yay, a guest has joined.');
    });
    $scope.updateStatus = function(data) {
      return Remote.sendUpdates(data, $routeParams.roomID);
    };
    sendCtrl = function($scope, $modalInstance) {
      $scope.result = {};
      $scope.ok = function() {
        return $modalInstance.close($scope.result.email);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    $scope.sendRemoteURL = function() {
      var modalInstance;
      modalInstance = Modal.open({
        templateUrl: 'haiku/partials/modals/send-remote-url.html',
        controller: sendCtrl
      });
      return modalInstance.result.then(function(email) {
        return Remote.sendRemoteURL($routeParams.roomID, email);
      });
    };
    shareCtrl = function($scope, $modalInstance) {
      $scope.newEmail = {
        value: ''
      };
      $scope.emails = [];
      $scope.add = function(email) {
        if (email != null ? email.length : void 0) {
          $scope.emails.push(email);
          return $scope.newEmail.value = '';
        }
      };
      $scope.remove = function(email) {
        return $scope.emails = _.filter($scope.emails, function(em) {
          return em !== email;
        });
      };
      $scope.ok = function() {
        return $modalInstance.close($scope.emails);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    $scope.shareURL = function() {
      var modalInstance;
      modalInstance = Modal.open({
        templateUrl: 'haiku/partials/modals/share.html',
        controller: shareCtrl
      });
      return modalInstance.result.then(function(emails) {
        return console.log(emails);
      });
    };
    if (!((_ref = $rootScope.categories) != null ? _ref.length : void 0)) {
      $location.path('/');
    }
    return $scope.navVisible = true;
  }
]);

angular.module('pl.paprikka.haiku.controllers.view', []).controller('HaikuViewCtrl', [
  '$location', '$routeParams', '$rootScope', '$scope', 'Remote', function($location, $routeParams, $rootScope, $scope, Remote) {
    $rootScope.clientRole = 'guest';
    $scope.test = 'bar';
    if (!$routeParams.roomID) {
      $location.path('/');
    }
    Remote.join($routeParams.roomID);
    return $rootScope.$on('haiku:room:joined', function(scope, data) {
      Remote.broadcastJoinedGuest(data.room);
      return $scope.$apply(function() {
        $rootScope.categories = data.categories;
        return $scope.status = 'ready';
      });
    });
  }
]);

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

angular.module('pl.paprikka.directives.haiku-import', ['pl.paprikka.haiku.services.slides', 'pl.paprikka.services.hammerjs', 'pl.paprikka.haiku.services.remote', 'pl.paprikka.directives.haiku.hTap', 'ngSanitize']).directive('haikuImport', [
  '$window', 'Slides', 'Hammer', 'Remote', '$rootScope', function($window, Slides, Hammer, Remote, $rootScope) {
    return {
      templateUrl: 'haiku/partials/haiku-import.html',
      restrict: 'AE',
      link: function(scope, elm, attrs) {}
    };
  }
]);

angular.module('pl.paprikka.directives.haiku', []).directive('haiku', [
  '$window', 'Hammer', 'Slides', '$rootScope', function($window, Hammer, Slides, $rootScope) {
    return {
      scope: {
        categories: '=',
        onUpdate: '&'
      },
      templateUrl: 'haiku/partials/haiku.html',
      restrict: 'AE',
      link: function(scope, elm, attrs) {
        var initSettings, onKeyDown, onMouseWheel;
        initSettings = function(scope) {
          scope.categories.currentCategory = 0;
          scope.categories.currentSlide = 0;
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
          console.log('haiku::updatePosition');
          _.each(scope.categories, function(cat, catIndex) {
            if (catIndex < scope.categories.currentCategory) {
              cat.status = 'prev';
            } else if (catIndex === scope.categories.currentCategory) {
              cat.status = 'current';
            } else if (catIndex > scope.categories.currentCategory) {
              cat.status = 'next';
            }
            return _.each(cat.slides, function(slide) {
              if (slide.index < scope.categories.currentSlide) {
                return slide.status = 'prev';
              } else if (slide.index === scope.categories.currentSlide) {
                return slide.status = 'current';
              } else if (slide.index > scope.categories.currentSlide) {
                return slide.status = 'next';
              }
            });
          });
          currCat = scope.categories.currentCategory;
          currSlide = scope.categories.currentSlide;
          scope.isLastCategory = currCat === scope.categories.length - 1 ? true : false;
          scope.isLastSlide = currSlide === ((_ref = scope.categories[currCat]) != null ? (_ref1 = _ref.slides) != null ? _ref1.length : void 0 : void 0) - 1 ? true : false;
          scope.isFirstCategory = currCat === 0 ? true : false;
          scope.isFirstSlide = currSlide === 0 ? true : false;
          return typeof scope.onUpdate === "function" ? scope.onUpdate({
            status: Slides["package"](scope.categories)
          }) : void 0;
        };
        scope.prevCategory = function() {
          if (!scope.isFirstCategory) {
            scope.categories.currentCategory = scope.categories.currentCategory - 1;
            return scope.categories.currentSlide = 0;
          }
        };
        scope.nextCategory = function() {
          if (!scope.isLastCategory) {
            scope.categories.currentCategory = scope.categories.currentCategory + 1;
            return scope.categories.currentSlide = 0;
          }
        };
        scope.prevSlide = function() {
          if (!scope.isFirstSlide) {
            return scope.categories.currentSlide = scope.categories.currentSlide - 1;
          }
        };
        scope.nextSlide = function() {
          if (!scope.isLastSlide) {
            return scope.categories.currentSlide = scope.categories.currentSlide + 1;
          }
        };
        scope.$watch('categories.currentCategory', scope.updatePosition);
        scope.$watch('categories.currentSlide', scope.updatePosition);
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
        $rootScope.$on('haiku:remote:control', function(e, data) {
          return scope.$apply(function() {
            var _ref;
            switch ((_ref = data.params) != null ? _ref.direction : void 0) {
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
        scope.$on('haiku:goto', function(slide) {
          return scope.goto(slide);
        });
        scope.$on('haiku:goto', function(slide) {
          return scope.goto(slide);
        });
        $rootScope.$on('haiku:remote:goto', function(e, slide) {
          return scope.goto(slide);
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
          return Slides.isCurrentSlide(slide, categories);
        };
        scope.goto = function(slide) {
          scope.categories.currentCategory = slide.categoryIndex;
          return scope.categories.currentSlide = slide.index;
        };
        return scope.getThemeClass = function() {
          return 'haiku--default';
        };
      }
    };
  }
]);

angular.module('pl.paprikka.haiku.directives.nav', ['pl.paprikka.haiku.services.slides']).directive('haikuNav', [
  '$rootScope', '$location', 'Slides', function($rootScope, $location, Slides) {
    return {
      scope: {
        categories: '=',
        visible: '=',
        control: '&navControl',
        enableRemote: '&onEnableRemote',
        share: '&onShare'
      },
      restrict: 'AE',
      replace: true,
      templateUrl: 'haiku/partials/directives/nav.html',
      link: function(scope, elm, attr) {
        scope.clientRole = $rootScope.clientRole;
        scope.goto = function(slide) {
          return $rootScope.$emit('haiku:remote:goto', slide);
        };
        scope.isCurrentCategory = function(cat) {
          return Slides.isCurrentCategory(cat, scope.categories);
        };
        scope.isCurrentSlide = function(slide) {
          return Slides.isCurrentSlide(slide, scope.categories);
        };
        return scope.close = function() {
          return $location.path('/');
        };
      }
    };
  }
]);

angular.module('pl.paprikka.services.hammerjs', []).factory('Hammer', [
  '$window', function($window) {
    return $window.Hammer;
  }
]);

angular.module('pl.paprikka.haiku.services.importer', ['pl.paprikka.services.markdown']).factory('Importer', [
  'Markdown', function(Markdown) {
    var Importer, defaultColors, indexSlides, markdown, markdownToSlides;
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
    Importer = function() {};
    Importer.get = function() {
      return indexSlides(markdownToSlides(markdown));
    };
    Importer.getFromFiles = function(files) {
      if (files.type === 'text') {
        return Importer.getFromMarkdown(files.data);
      } else if (files.type === 'images') {
        return Importer.getFromImages(files.data);
      } else {
        return [];
      }
    };
    Importer.getFromMarkdown = function(markdown) {
      return indexSlides(markdownToSlides(markdown));
    };
    Importer.getFromImages = function(images) {
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
    return Importer;
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
    var HUB_LOCATION, Remote, SOCKET_LOCATION, socket;
    console.log('Remote::init');
    HUB_LOCATION = 'http://haiku-hub.herokuapp.com:80';
    SOCKET_LOCATION = location.hostname.split('.')[0] === '192' ? location.hostname + ':8082' : HUB_LOCATION;
    socket = WebSockets.connect(SOCKET_LOCATION);
    socket.on('connect', function() {
      console.log('haiku::Remote::connected');
      socket.on('remote', function(data) {
        return $rootScope.$emit('haiku:remote:control', data);
      });
      socket.on('room:remoteJoined', function(data) {
        return $rootScope.$emit('haiku:room:remoteJoined', data);
      });
      socket.on('room:guestJoined', function(data) {
        return $rootScope.$emit('haiku:room:guestJoined', data);
      });
      socket.on('room:accepted', function(data) {
        return $rootScope.$emit('haiku:room:accepted', data);
      });
      socket.on('room:joined', function(data) {
        return $rootScope.$emit('haiku:room:joined', data);
      });
      socket.on('remote:URLSent', function(data) {
        return $rootScope.$emit('haiku:remote:URLSent', data);
      });
      return socket.on('remote:URLShared', function(data) {
        return $rootScope.$emit('haiku:remote:URLShared', data);
      });
    });
    return Remote = {
      join: function(room) {
        return socket.emit('room:join', {
          room: room
        });
      },
      leave: function(room, cb) {
        return socket.emit('room:leave', {
          room: room
        });
      },
      request: function(categories) {
        return socket.emit('room:request', {
          categories: categories
        });
      },
      sendRemoteURL: function(room, to) {
        return socket.emit('remote:sendURL', {
          room: room,
          to: to
        });
      },
      shareURL: function(room, to) {
        return socket.emit('remote:shareURL', {
          room: room,
          to: to
        });
      },
      broadcastJoinedGuest: function(room) {
        return socket.emit('remote:guestJoined', {
          room: room
        });
      },
      sendUpdates: function(data, room) {
        console.log('haiku::update', data, room, socket);
        return socket.emit('remote:update', {
          data: data,
          room: room
        });
      }
    };
  }
]);

angular.module('pl.paprikka.haiku.services.slides', []).factory('Slides', [
  function() {
    var Slides;
    Slides = function() {};
    Slides.getCurrentCategory = function(categories) {
      return _.find(categories, {
        status: 'current'
      });
    };
    Slides.isCurrentCategory = function(cat) {
      return cat.status === 'current';
    };
    Slides.isCurrentSlide = function(slide, categories) {
      return slide.index === categories.currentSlide && slide.categoryIndex === categories.currentCategory;
    };
    Slides["package"] = function(categories) {
      var cleanedCategories;
      cleanedCategories = _.map(categories, function(cat) {
        return {
          slides: _.map(cat.slides, function(slide) {
            return {
              index: slide.index,
              categoryIndex: slide.categoryIndex
            };
          })
        };
      });
      cleanedCategories = JSON.parse(angular.toJson(cleanedCategories));
      return _.extend({
        categories: cleanedCategories
      }, _.pick(categories, 'currentCategory', 'currentSlide'));
    };
    return Slides;
  }
]);

'use strict';

App = angular.module('app', ['templates', 'ngCookies', 'ngResource', 'app.controllers', 'ui.bootstrap', 'ui.bootstrap.tpls', 'pl.paprikka.haiku']);

App.config([
  '$routeProvider', '$locationProvider', '$modalProvider', '$tooltipProvider', function($routeProvider, $locationProvider, $modalProvider, $tooltipProvider) {
    $routeProvider.when('/404', {
      templateUrl: 'pages/404.html'
    }).when('/', {
      templateUrl: 'haiku/partials/views/import.html',
      controller: 'HaikuImportCtrl'
    }).when('/play/:roomID', {
      templateUrl: 'haiku/partials/views/play.html',
      controller: 'HaikuPlayCtrl'
    }).when('/view/:roomID', {
      templateUrl: 'haiku/partials/views/view.html',
      controller: 'HaikuViewCtrl'
    }).otherwise({
      redirectTo: '/404'
    });
    $locationProvider.html5Mode(false);
    $modalProvider.options = {
      modalOpenClass: 'disabled',
      backdrop: 'static',
      dialogClass: 'modal dialog-modal modal--default'
    };
    return $tooltipProvider.options({
      popupDelay: 600
    });
  }
]).run();

/*
//@ sourceMappingURL=app.js.map
*/