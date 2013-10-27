angular.module('templates', ['common/partials/modal-prompt.html', 'drop/drop.html', 'haiku/partials/directives/nav.html', 'haiku/partials/haiku-import.html', 'haiku/partials/haiku.html', 'haiku/partials/modals/send-remote-url.html', 'haiku/partials/modals/share.html', 'haiku/partials/views/import.html', 'haiku/partials/views/play.html', 'haiku/partials/views/view.html', 'head.html', 'index.html', 'pages/404.html', 'pages/partials/intro.html']);

angular.module("common/partials/modal-prompt.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/partials/modal-prompt.html",
    "{{ test }}");
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

angular.module("haiku/partials/directives/nav.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/directives/nav.html",
    "\n" +
    "<div ng-class=\" { 'haiku-nav--hidden' : !visible } \" class=\"haiku-nav\">\n" +
    "  <div class=\"haiku-nav__tools\">\n" +
    "    <button ng-show=\"clientRole == 'host'\" h-tap=\"close()\" class=\"haiku__close-btn\"><i></i></button>\n" +
    "    <button ng-show=\"clientRole == 'host'\" h-tap=\"enableRemote()\" class=\"haiku__remote-btn\"><i></i></button>\n" +
    "    <button ng-show=\"clientRole == 'host'\" h-tap=\"share()\" class=\"haiku__share-btn\"><i></i></button>\n" +
    "  </div>\n" +
    "  <ol ng-show=\"categories.length &gt; 1\" class=\"haiku-nav__categories\">\n" +
    "    <li ng-repeat=\"category in categories\" ng-class=\"{ 'haiku-nav__category--current' : currentCategory == isCurrentCategory(category) }\" class=\"haiku-nav__category\">\n" +
    "      <button ng-class=\"{'haiku-nav__button--active': isCurrentCategory(category)}\" h-tap=\"goto({index: 0, categoryIndex: $index})\" class=\"haiku-nav__button\"></button>\n" +
    "    </li>\n" +
    "  </ol>\n" +
    "  <ol ng-show=\"categories[categories.currentCategory].slides.length &gt; 1\" class=\"haiku-nav__slides\">\n" +
    "    <li ng-repeat=\"slide in categories[categories.currentCategory].slides\" class=\"haiku-nav__slide\">\n" +
    "      <button ng-class=\"{'haiku-nav__button--active': isCurrentSlide(slide)}\" h-tap=\"goto(slide)\" class=\"haiku-nav__button\"></button>\n" +
    "    </li>\n" +
    "  </ol>\n" +
    "</div>");
}]);

angular.module("haiku/partials/haiku-import.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/haiku-import.html",
    "\n" +
    "<h1>Haiku import</h1>");
}]);

angular.module("haiku/partials/haiku.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/haiku.html",
    "\n" +
    "<div ng-class=\"getThemeClass()\" class=\"haiku\">\n" +
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
    "  </div>\n" +
    "</div>");
}]);

angular.module("haiku/partials/modals/send-remote-url.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/modals/send-remote-url.html",
    "\n" +
    "<div class=\"modal__title\">\n" +
    "  <h2>Get Remote Control URL</h2>\n" +
    "</div>\n" +
    "<div class=\"modal__body\">\n" +
    "  <form name=\"form\" class=\"form\">\n" +
    "    <div class=\"form-item\">\n" +
    "      <input name=\"modalEmail\" type=\"email\" placeholder=\"Type your email here\" ng-model=\"result.email\" required=\"required\" class=\"input-text input-text--huge input--full\"/>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal__footer\">\n" +
    "  <button ng-disabled=\"form.modalEmail.$invalid\" ng-click=\"ok()\" class=\"btn btn--positive\">Ok, send.</button>\n" +
    "  <button ng-click=\"cancel()\" class=\"btn btn--negative\">Cancel</button>\n" +
    "</div>");
}]);

angular.module("haiku/partials/modals/share.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/modals/share.html",
    "\n" +
    "<div class=\"modal__title\">\n" +
    "  <h2>\n" +
    "     \n" +
    "    Share a haiku: \n" +
    "    <input copy-on-select=\"copy-on-select\" ng-model=\"currentURL\" readonly=\"readonly\" class=\"input-text input--paste\"/>\n" +
    "  </h2>\n" +
    "</div>\n" +
    "<div class=\"modal__body\">\n" +
    "  <ul class=\"haiku-share__emails\">\n" +
    "    <li ng-show=\"!emails.length\">\n" +
    "      <div class=\"beta\">Boooo</div>\n" +
    "      <p>No one's invited to the party :(</p>\n" +
    "    </li>\n" +
    "    <li ng-repeat=\"email in emails\" class=\"haiku-share__email\"><span>{{email}}</span>\n" +
    "      <button ng-click=\"remove(email)\" tabindex=\"-1\" class=\"haiku-share__remove\">&times;</button>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <form name=\"form\" novalidate=\"novalidate\" ng-submit=\"add(newEmail.value)\" class=\"form\">\n" +
    "    <div class=\"form-item\">\n" +
    "      <input name=\"modalEmail\" type=\"email\" placeholder=\"Add new email...\" ng-model=\"newEmail.value\" required=\"required\" class=\"haiku-share__add-input\"/>\n" +
    "      <button ng-disabled=\"form.modalEmail.$invalid\" ng-click=\"add(newEmail.value)\" class=\"haiku-share__add\">Add</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal__footer\">\n" +
    "  <button ng-disabled=\"!emails.length\" ng-click=\"ok()\" class=\"btn btn--positive\">Ok, send.</button>\n" +
    "  <button ng-click=\"cancel()\" class=\"btn btn--negative\">Cancel</button>\n" +
    "</div>");
}]);

angular.module("haiku/partials/views/import.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/views/import.html",
    "\n" +
    "<div class=\"haiku-import\"><a href=\"examples/categories.md\" target=\"_blank\" download=\"drag me to the browser window.md\" class=\"import__example\">Get example haiku</a>\n" +
    "  <ppk-drop on-drop=\"onFileDropped(file)\" files=\"files\"></ppk-drop>\n" +
    "</div>");
}]);

angular.module("haiku/partials/views/play.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/views/play.html",
    "\n" +
    "<div ng-dblclick=\"navVisible = !navVisible\" class=\"page-content\">\n" +
    "  <div ng-if=\"categories.length\" ng-show=\"UIReady\">\n" +
    "    <haiku categories=\"categories\" on-update=\"updateStatus(status)\"></haiku>\n" +
    "    <haiku-nav categories=\"categories\" visible=\"navVisible\" on-enable-remote=\"sendRemoteURL()\" on-share=\"shareURL()\"></haiku-nav>\n" +
    "  </div>\n" +
    "  <div ng-hide=\"UIReady\" class=\"haiku-loading\">\n" +
    "    <div class=\"haiku-loading__label\">Loading...</div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("haiku/partials/views/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("haiku/partials/views/view.html",
    "\n" +
    "<div ng-dblclick=\"navVisible = !navVisible\" class=\"page-content\">\n" +
    "  <div ng-switch=\"status\">\n" +
    "    <div ng-switch-when=\"ready\" ng-show=\"UIReady\">\n" +
    "      <haiku categories=\"categories\" on-update=\"updateStatus(status)\"></haiku>\n" +
    "      <haiku-nav categories=\"categories\" visible=\"navVisible\"></haiku-nav>\n" +
    "    </div>\n" +
    "    <div ng-hide=\"UIReady\" class=\"haiku-loading\">\n" +
    "      <div class=\"haiku-loading__label\">Loading...</div>\n" +
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
    "  <title>Haikµ</title>\n" +
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
    "    <title>Haikµ</title>\n" +
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
