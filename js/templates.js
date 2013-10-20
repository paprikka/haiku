angular.module('templates', ['canvas/directives/drag-rectangle.html', 'canvas/directives/partials/canvas.html', 'canvas/directives/partials/editor.html', 'canvas/views/edit.html', 'drop/drop.html', 'hacker-news/partials/index.html', 'haiku/partials/haiku.html', 'head.html', 'index.html', 'pages/404.html', 'pages/partials/intro.html', 'ui/logo/logo.html']);

angular.module("canvas/directives/drag-rectangle.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/directives/drag-rectangle.html",
    "\n" +
    "<div ng-style=\"coords\" ng-class=\" { 'is-scaling' : state == 'scaling' } \" class=\"ppk-drag-rectangle\">\n" +
    "  <div class=\"ppk-drag-rectangle__overlay-top\"></div>\n" +
    "  <div class=\"ppk-drag-rectangle__overlay-right\"></div>\n" +
    "  <div class=\"ppk-drag-rectangle__overlay-bottom\"></div>\n" +
    "  <div class=\"ppk-drag-rectangle__overlay-left\"></div>\n" +
    "</div>");
}]);

angular.module("canvas/directives/partials/canvas.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/directives/partials/canvas.html",
    "");
}]);

angular.module("canvas/directives/partials/editor.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/directives/partials/editor.html",
    "\n" +
    "<div class=\"ppk-canvas\">\n" +
    "  <div class=\"ppk-canvas__container\">\n" +
    "    <div ng-hide=\"files.length\" class=\"ppk-canvas__drop\">\n" +
    "      <ppk-drop on-drop=\"handleFiles()\" files=\"files\"></ppk-drop>\n" +
    "    </div>\n" +
    "    <div ng-show=\"files.length\" class=\"ppk-canvas__preview\"><img class=\"ppk-canvas__image\"/>\n" +
    "      <canvas width=\"640\" height=\"480\" class=\"ppk-canvas__editor\"></canvas>\n" +
    "      <ppk-drag-rectangle position=\"position\"></ppk-drag-rectangle>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"ppk-canvas__tools\">\n" +
    "    <button tabindex=\"-1\" ng-click=\"clear()\" class=\"ppk-canvas__tool ppk-canvas__clear\">&times;</button>\n" +
    "    <button tabindex=\"-1\" ng-click=\"download()\" class=\"ppk-canvas__tool ppk-canvas__save\">Pobierz;</button>\n" +
    "    <div class=\"float--right\">\n" +
    "      <input type=\"number\" placeholder=\"Width\"/>&times;\n" +
    "      <input type=\"number\" placeholder=\"Height\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("canvas/views/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/views/edit.html",
    "\n" +
    "<ppk-canvas-editor></ppk-canvas-editor>");
}]);

angular.module("drop/drop.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("drop/drop.html",
    "\n" +
    "<div class=\"ppk-drop\">\n" +
    "  <div ng-class=\" { 'is-file-over' : isFileOver } \" class=\"ppk-drop__box\">\n" +
    "    <input type=\"file\" multiple=\"multiple\" ng-class=\" { 'ppk-drop__input--polyfill': supportsUploadClickDelegation } \" class=\"ppk-drop__input\"/>\n" +
    "    <div class=\"ppk-drop__info\"><i></i>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("hacker-news/partials/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("hacker-news/partials/index.html",
    "\n" +
    "<h1 class=\"alpha\">HN Index</h1>\n" +
    "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>\n" +
    "<ul class=\"news\">\n" +
    "  <li ng-repeat=\"newsItem in news\" class=\"news__item\"><a ng-href=\"{{newsItem.url}}\" class=\"news__title\">{{ newsItem.title }}</a></li>\n" +
    "</ul>");
}]);

angular.module("haiku/partials/haiku.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/haiku.html",
    "\n" +
    "<div ng-class=\"getThemeClass()\" class=\"haiku\">\n" +
    "  <div ng-show=\"!categories.length\">\n" +
    "    <ppk-drop on-drop=\"onFileDropped(file)\" files=\"files\"></ppk-drop>\n" +
    "  </div>\n" +
    "  <div ng-show=\"categories.length\" ng-dblclick=\"navVisible = !navVisible\">\n" +
    "    <ol class=\"haiku__categories\">\n" +
    "      <li ng-repeat=\"category in categories\" ng-class=\"getCategoryClass(category)\" class=\"haiku__category\">\n" +
    "        <div class=\"haiku__category-content\">\n" +
    "          <ol ng-show=\"category.slides.length\" class=\"haiku__slides\">\n" +
    "            <li ng-repeat=\"slide in category.slides\" ng-style=\"getSlideStyle(slide)\" ng-class=\"getSlideClass(slide)\" class=\"haiku__slide\">\n" +
    "              <section ng-bind-html=\"slide.body\" class=\"haiku__slide-content\"></section>\n" +
    "            </li>\n" +
    "          </ol>\n" +
    "        </div>\n" +
    "      </li>\n" +
    "    </ol>\n" +
    "    <div ng-class=\" { 'haiku-nav--hidden' : !navVisible } \" class=\"haiku-nav\">\n" +
    "      <button class=\"haiku__close-btn\"><i></i></button>\n" +
    "      <ol class=\"haiku-nav__categories\">\n" +
    "        <li ng-repeat=\"category in categories\" ng-class=\"{ 'haiku-nav__category--current' : currentCategory == slide.categoryIndex }\" class=\"haiku-nav__category\">\n" +
    "          <div class=\"haiku-nav__category-content\">\n" +
    "            <ol class=\"haiku-nav__slides\">\n" +
    "              <li ng-repeat=\"slide in category.slides\" class=\"haiku-nav__slide\">\n" +
    "                <button ng-class=\"{'haiku-nav__button--active': isCurrentSlide(slide)}\" h-tap=\"goto(slide)\" class=\"haiku-nav__button\"></button>\n" +
    "              </li>\n" +
    "            </ol>\n" +
    "          </div>\n" +
    "        </li>\n" +
    "      </ol>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("head.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("head.html",
    "\n" +
    "<head>\n" +
    "  <meta charset=\"utf-8\"/>\n" +
    "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\"/>\n" +
    "  <meta name=\"HandheldFriendly\" content=\"True\"/>\n" +
    "  <meta name=\"MobileOptimized\" content=\"320\"/>\n" +
    "  <meta content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" name=\"viewport\"/>\n" +
    "  <meta http-equiv=\"cleartype\" content=\"on\"/>\n" +
    "  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\"/>\n" +
    "  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\"/>\n" +
    "  <meta name=\"apple-mobile-web-app-title\" content=\"Haiku\"/>\n" +
    "  <meta name=\"description\" content=\"\"/>\n" +
    "  <meta name=\"author\" content=\"Rafał Pastuszak &lt;rafal@paprikka.pl&gt;\"/>\n" +
    "  <meta name=\"robots\" content=\"noindex\"/>\n" +
    "  <title>Application Title</title>\n" +
    "  <link rel=\"stylesheet\" href=\"css/app.css\"/>\n" +
    "  <script>\n" +
    "    (function() {\n" +
    "      var method;\n" +
    "      var noop = function noop() {};\n" +
    "      var methods = [\n" +
    "          'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',\n" +
    "          'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',\n" +
    "          'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',\n" +
    "          'timeStamp', 'trace', 'warn'\n" +
    "      ];\n" +
    "      var length = methods.length;\n" +
    "      var console = (window.console = window.console || {});\n" +
    "      \n" +
    "      while (length--) {\n" +
    "          method = methods[length];\n" +
    "          \n" +
    "          // Only stub undefined methods.\n" +
    "          if (!console[method]) {\n" +
    "              console[method] = noop;\n" +
    "          }\n" +
    "      }\n" +
    "    }());\n" +
    "  </script><!--[if lte IE 8]>\n" +
    "  <script src=\"//html5shiv.googlecode.com/svn/trunk/html5.js\"></script><![endif]-->\n" +
    "  <script src=\"js/modernizr.js\"></script>\n" +
    "  <script src=\"//haiku-hub.herokuapp.com/socket.io/socket.io.js\"></script>\n" +
    "  <script src=\"js/vendor.js\"></script>\n" +
    "  <script src=\"js/templates.js\"></script>\n" +
    "  <script src=\"js/app.js\"></script>\n" +
    "</head>");
}]);

angular.module("index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("index.html",
    "<!DOCTYPE html><!--[if lt IE 7]><html class=\"no-js lt-ie9 lt-ie8 lt-ie7\" lang=\"en\"><![endif]--><!--[if IE 7]><html class=\"no-js lt-ie9 lt-ie8\" lang=\"en\"><![endif]--><!--[if IE 8]><html class=\"no-js lt-ie9\" lang=\"en\"><![endif]--><!--[if gt IE 8]><!-->\n" +
    "<html lang=\"en\" class=\"no-js\">\n" +
    "  <!-- <![endif]-->\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n" +
    "    <meta name=\"HandheldFriendly\" content=\"True\">\n" +
    "    <meta name=\"MobileOptimized\" content=\"320\">\n" +
    "    <meta content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" name=\"viewport\">\n" +
    "    <meta http-equiv=\"cleartype\" content=\"on\">\n" +
    "    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n" +
    "    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">\n" +
    "    <meta name=\"apple-mobile-web-app-title\" content=\"Haiku\">\n" +
    "    <meta name=\"description\" content=\"\">\n" +
    "    <meta name=\"author\" content=\"Rafał Pastuszak &lt;rafal@paprikka.pl&gt;\">\n" +
    "    <meta name=\"robots\" content=\"noindex\">\n" +
    "    <title>Application Title</title>\n" +
    "    <link rel=\"stylesheet\" href=\"css/app.css\">\n" +
    "    <script>\n" +
    "      (function() {\n" +
    "        var method;\n" +
    "        var noop = function noop() {};\n" +
    "        var methods = [\n" +
    "            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',\n" +
    "            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',\n" +
    "            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',\n" +
    "            'timeStamp', 'trace', 'warn'\n" +
    "        ];\n" +
    "        var length = methods.length;\n" +
    "        var console = (window.console = window.console || {});\n" +
    "        \n" +
    "        while (length--) {\n" +
    "            method = methods[length];\n" +
    "            \n" +
    "            // Only stub undefined methods.\n" +
    "            if (!console[method]) {\n" +
    "                console[method] = noop;\n" +
    "            }\n" +
    "        }\n" +
    "      }());\n" +
    "    </script><!--[if lte IE 8]>\n" +
    "    <script src=\"//html5shiv.googlecode.com/svn/trunk/html5.js\"></script><![endif]-->\n" +
    "    <script src=\"js/modernizr.js\"></script>\n" +
    "    <script src=\"//haiku-hub.herokuapp.com/socket.io/socket.io.js\"></script>\n" +
    "    <script src=\"js/vendor.js\"></script>\n" +
    "    <script src=\"js/templates.js\"></script>\n" +
    "    <script src=\"js/app.js\"></script>\n" +
    "  </head>\n" +
    "  <body ng-controller=\"AppCtrl\" ng-app=\"app\" id=\"ng-app\">\n" +
    "    <div class=\"viewport\">\n" +
    "      <div ng-view class=\"viewport__content\"></div>\n" +
    "    </div>\n" +
    "    <script>\n" +
    "      $('body').on('touchmove', function (e) {\n" +
    "         if (!$('.scrollable').has($(e.target)).length) e.preventDefault();\n" +
    "      });\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>");
}]);

angular.module("pages/404.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pages/404.html",
    "\n" +
    "<h1 class=\"alpha deco\">Four oh Four</h1>");
}]);

angular.module("pages/partials/intro.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pages/partials/intro.html",
    "\n" +
    "<div class=\"page-content\">\n" +
    "  <div class=\"intro-wrapper\">\n" +
    "    <haiku></haiku>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("ui/logo/logo.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/logo/logo.html",
    "\n" +
    "<div class=\"app-logo\"><span class=\"app-logo__title\">Veeery </span>opinionated</div>");
}]);
