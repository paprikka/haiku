'use strict';
/* Controllers*/

var App, HaikuPlayCtrl;

angular.module('app.controllers', []).controller('AppCtrl', [
  '$scope', '$location', '$rootScope', 'Modal', function($scope, $location, $rootScope, Modal) {
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

angular.module('app.common.directives.CopyOnSelect', []).directive('copyOnSelect', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, elm, attr) {
        return elm.on('focus', function(e) {
          var _this = this;
          return _.defer(function() {
            return _this.select();
          });
        });
      }
    };
  }
]);

angular.module("app.common.services.Modal", ['ui.bootstrap', 'ui.bootstrap.tpls']).service('Modal', [
  '$modal', function($modal) {
    var methods;
    window.m = $modal;
    methods = {
      alert: function(title, body, icon) {
        var alertCtrl, modalInstance;
        alertCtrl = function($scope, $modalInstance, data) {
          $scope.data = data;
          $scope.close = function() {
            return $modalInstance.dismiss('close');
          };
          return $scope.getIconClass = function() {
            if (data.icon) {
              return 'icon-' + data.icon;
            } else {
              return '';
            }
          };
        };
        modalInstance = $modal.open({
          templateUrl: 'common/partials/modals/alert.html',
          controller: alertCtrl,
          resolve: {
            data: function() {
              return {
                title: title || 'Message',
                body: body,
                icon: icon
              };
            }
          }
        });
        return modalInstance.result.then(function() {});
      }
    };
    return _.extend($modal, methods);
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

angular.module('app.common.services.pageState', []).service('PageState', [
  '$window', function($window) {
    var PageState;
    PageState = (function() {
      function PageState() {}

      PageState.prototype.enable = function() {
        if (location.hostname === 'localhost' || location.hostname.split('.')[0] === '192') {
          return;
        }
        return $window.onbeforeunload = function() {
          return 'Do you really want to leave and remove your haiku?';
        };
      };

      PageState.prototype.disable = function() {
        return $window.onbeforeunload = null;
      };

      return PageState;

    })();
    return new PageState;
  }
]);

angular.module('app.common.services.CORS', []).config([
  '$httpProvider', function($httpProvider) {
    console.log('common.services.CORSService enabled.');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    return delete $httpProvider.defaults.headers.common['Content-Type'];
  }
]);

angular.module('app.common.services.Resizer', []).service('Resizer', [
  '$q', function($q) {
    var Resizer;
    Resizer = function() {};
    Resizer.prototype.resize = function(img, options) {
      var canvas, context, defaults, deferred, height, resized, width;
      deferred = $q.defer();
      defaults = {
        maxSize: 1024
      };
      options = _.extend(defaults, options);
      canvas = document.createElement('canvas');
      context = canvas.getContext('2d');
      width = img.width;
      height = img.height;
      if (width > height) {
        if (width > options.maxSize) {
          height = height * options.maxSize / width;
          width = options.maxSize;
        }
      } else {
        if (height > options.maxSize) {
          width = width * options.maxSize / height;
          height = options.maxSize;
        }
      }
      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, 0, 0, width, height);
      console.log('Resizer::resize, working...');
      resized = {
        img: canvas.toDataURL('image/jpeg', {
          quality: .1
        })
      };
      deferred.resolve(resized);
      return deferred.promise;
    };
    return new Resizer;
  }
]);

angular.module('app.common.webSockets', []).service('WebSockets', [
  '$window', function($window) {
    return window.io;
  }
]);

angular.module('pl.paprikka.directives.drop', []).directive('ppkDrop', [
  '$window', 'Modal', function($window, Modal) {
    return {
      restrict: 'AE',
      templateUrl: 'drop/drop.html',
      replace: true,
      scope: {
        onDrop: '&',
        files: '='
      },
      link: function(scope, elm, attrs) {
        var boxEl, getFileType, getImageFiles, getTextFiles, messages, onDragEnter, onDragLeave, onDragOver, onDrop;
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
        messages = {
          unsupportedType: {
            title: 'Unsupported file type',
            body: "Use Markdown (*.md, *.txt) or images to create a Haikµ. <br>\nLike to see a different format / feature here? <a target=\"_blank\" href=\"mailto:gethaiku@gmail.com\">Let us know</a>!",
            icon: 'upload'
          }
        };
        onDrop = function(e) {
          var dt;
          e.stopPropagation();
          e.preventDefault();
          dt = e.dataTransfer;
          scope.$apply(function() {
            scope.files = dt.files;
            return scope.isFileOver = false;
          });
          return scope.handleUpload(dt);
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
          var m, type, _ref;
          if ((_ref = dt.files) != null ? _ref[0] : void 0) {
            type = getFileType(dt.files[0]);
            if (type === 'text') {
              return getTextFiles(dt.files[0], scope.onDrop);
            } else if (type === 'images') {
              return getImageFiles(dt.files, scope.onDrop);
            } else {
              m = messages.unsupportedType;
              return Modal.alert(m.title, m.body, m.icon);
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

angular.module('pl.paprikka.haiku', ['ngSanitize', 'app.common.services.pageState', 'app.common.services.CORS', 'pl.paprikka.directives.haiku', 'pl.paprikka.directives.drop', 'pl.paprikka.haiku.directives.nav', 'pl.paprikka.directives.haiku.hTap', 'pl.paprikka.services.hammerjs', 'pl.paprikka.haiku.services.remote', 'pl.paprikka.haiku.services.slides', 'pl.paprikka.haiku.controllers.import', 'pl.paprikka.haiku.controllers.play', 'pl.paprikka.haiku.controllers.view']);

angular.module('pl.paprikka.haiku.controllers.import', ['pl.paprikka.haiku.services.importer', 'app.common.services.Notify']).controller('HaikuImportCtrl', [
  'Importer', '$location', '$rootScope', '$scope', 'Remote', 'Modal', 'Notify', function(Importer, $location, $rootScope, $scope, Remote, Modal, Notify) {
    $rootScope.categories = [];
    $scope.files = [];
    $scope.state = 'idle';
    $scope.mdSupported = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? false : true;
    Remote.connect();
    $scope.initConnection = function(categories) {
      return Remote.request(categories);
    };
    return $scope.onFileDropped = function(data) {
      if (!$scope.$$phase) {
        $scope.$apply(function() {
          return $scope.state = 'sending';
        });
      }
      return _.defer(function() {
        return $scope.$apply(function() {
          $rootScope.$on('haiku:room:accepted', function(e, data) {
            $rootScope.clientRole = 'host';
            $location.path('/play/' + data.room);
            return $scope.$apply();
          });
          return Importer.getFromFiles(data).then(function(result) {
            $rootScope.categories = result;
            window.categories = $rootScope.categories;
            if ($rootScope.categories.length) {
              $scope.initConnection($rootScope.categories);
            }
            return console.log('Categories loaded: ', $scope.categories);
          });
        });
      });
    };
  }
]);

HaikuPlayCtrl = angular.module('pl.paprikka.haiku.controllers.play', ['app.common.services.Modal', 'app.common.directives.CopyOnSelect']).controller('HaikuPlayCtrl', [
  '$location', '$routeParams', '$rootScope', '$scope', '$timeout', 'Remote', 'Slides', 'Modal', 'Notify', 'PageState', function($location, $routeParams, $rootScope, $scope, $timeout, Remote, Slides, Modal, Notify, PageState) {
    var sendCtrl, shareCtrl, showUI, _ref;
    PageState.enable();
    showUI = function() {
      return $scope.UIReady = true;
    };
    $timeout(showUI, 2000);
    $rootScope.$on('haiku:remote:URLShared', function() {
      return Notify.info('Invitations sent.');
    });
    $rootScope.$on('haiku:room:readyToShare', function() {
      return Notify.info('Haiku is ready to share.');
    });
    $rootScope.$on('haiku:remote:URLSent', function() {
      return Notify.info('Remote bookmark sent.');
    });
    $rootScope.$on('haiku:room:remoteJoined', function() {
      console.log('Haiku::Remote joined, sending current status...');
      $scope.updateStatus(Slides["package"]($scope.categories));
      return Notify.info('Remote connected.');
    });
    $rootScope.$on('haiku:room:guestJoined', function() {
      return Notify.info('New guest has joined.');
    });
    $scope.updateStatus = function(data) {
      return Remote.sendUpdates(data, $routeParams.roomID);
    };
    sendCtrl = function($scope, $modalInstance) {
      var onConnected;
      $scope.result = {};
      $scope.currentEncodedURL = encodeURIComponent(haiku.config.remoteURL + '/#/' + $routeParams.roomID);
      onConnected = $rootScope.$on('haiku:room:remoteJoined', function() {
        $scope.cancel();
        return onConnected();
      });
      $scope.ok = function(isOK) {
        if (isOK) {
          return $modalInstance.close($scope.result.email);
        }
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
      var getCurrentURL;
      $scope.newEmail = {
        value: ''
      };
      $scope.emails = [];
      getCurrentURL = function() {
        return location.toString().replace(/#\/play\//i, "#/view/");
      };
      $scope.currentURL = getCurrentURL();
      $scope.currentEncodedURL = encodeURIComponent($scope.currentURL);
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
        console.log(emails);
        return Remote.shareURL($routeParams.roomID, emails);
      });
    };
    if (!((_ref = $rootScope.categories) != null ? _ref.length : void 0)) {
      $location.path('/');
    }
    return $scope.navVisible = true;
  }
]);

angular.module('pl.paprikka.haiku.controllers.view', []).controller('HaikuViewCtrl', [
  '$http', '$location', '$routeParams', '$rootScope', '$scope', '$timeout', 'Remote', function($http, $location, $routeParams, $rootScope, $scope, $timeout, Remote) {
    $scope.status = 'loading';
    $rootScope.clientRole = 'guest';
    $scope.test = 'bar';
    if (!$routeParams.roomID) {
      $location.path('/');
    }
    Remote.join($routeParams.roomID);
    $rootScope.$on('haiku:room:joined', function(scope, data) {
      var onDataLoaded;
      onDataLoaded = function(res) {
        var showUI;
        Remote.broadcastJoinedGuest(data.room);
        $rootScope.categories = res.categories;
        $scope.status = 'ready';
        showUI = function() {
          return $scope.UIReady = true;
        };
        return $timeout(showUI, 2000);
      };
      return $http.get(data.categories).success(onDataLoaded);
    });
    return $scope.navVisible = true;
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
  '$window', '$sce', 'Hammer', 'Slides', '$rootScope', function($window, $sce, Hammer, Slides, $rootScope) {
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
            if (data.command === 'position') {
              return scope.goto({
                index: data.params.currentSlide,
                categoryIndex: data.params.currentCategory
              });
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
  '$rootScope', '$location', 'Slides', 'Modal', function($rootScope, $location, Slides, Modal) {
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
        var closeCtrl;
        $rootScope.$on('haiku:room:readyToShare', function() {
          return scope.$apply(function() {
            return scope.readyToShare = true;
          });
        });
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
        closeCtrl = function($scope, $modalInstance) {
          $scope.ok = function() {
            return $modalInstance.close(true);
          };
          return $scope.cancel = function() {
            return $modalInstance.dismiss('cancel');
          };
        };
        return scope.close = function() {
          var modalInstance;
          modalInstance = Modal.open({
            templateUrl: 'haiku/partials/modals/close.html',
            controller: closeCtrl
          });
          return modalInstance.result.then(function(result) {
            if (result) {
              return $location.path('/');
            }
          });
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

angular.module('pl.paprikka.haiku.services.importer', ['pl.paprikka.services.markdown', 'app.common.services.Resizer']).factory('Importer', [
  'Markdown', 'Resizer', '$q', function(Markdown, Resizer, $q) {
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
        slidesContents = cat.replace(/<h1.*?>/gi, '__PAGE_BREAK__<h1>').split('__PAGE_BREAK__');
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
      var deferred, result;
      deferred = $q.defer();
      if (files.type === 'text') {
        result = Importer.getFromMarkdown(files.data);
        deferred.resolve(result);
      } else if (files.type === 'images') {
        Importer.getFromImages(files.data, deferred);
      } else {
        [];
      }
      return deferred.promise;
    };
    Importer.getFromMarkdown = function(markdown) {
      return indexSlides(markdownToSlides(markdown));
    };
    Importer.getFromImages = function(images, deferred) {
      var categories;
      categories = [
        {
          slides: []
        }
      ];
      return _.each(images, function(img) {
        var imgEl;
        imgEl = new Image;
        imgEl.onload = function() {
          return Resizer.resize(imgEl).then(function(resized) {
            var slide;
            slide = {
              background: 'url(' + resized.img + ')'
            };
            categories[0].slides.push(slide);
            if (categories[0].slides.length === images.length) {
              return deferred.resolve(indexSlides(categories));
            }
          });
        };
        return imgEl.src = img;
      });
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
    var Remote, SOCKET_LOCATION, clearListeners, socket;
    console.log('Remote::init');
    SOCKET_LOCATION = haiku.config.hubURL;
    socket = WebSockets.connect(SOCKET_LOCATION);
    socket.on('connect', function() {
      console.log('haiku::Remote::connected');
      $rootScope.$apply();
      socket.on('room:readyToShare', function(data) {
        return $rootScope.$emit('haiku:room:readyToShare', data);
      });
      socket.on('error', function(data) {
        console.error('Socket error', data);
        return $rootScope.$emit('haiku:error', data);
      });
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
    clearListeners = function() {
      var listeners;
      listeners = $rootScope.$$listeners;
      return _.forIn(listeners, function(value, key) {
        if (key.split(':')[0] === 'haiku') {
          return $rootScope.$$listeners[key] = null;
        }
      });
    };
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
      connect: function() {
        return clearListeners();
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

App = angular.module('app', ['templates', 'ngCookies', 'ngResource', 'ngRoute', 'ngRoute', 'app.controllers', 'ui.bootstrap', 'ui.bootstrap.tpls', 'pl.paprikka.haiku']);

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