'use strict';
var App;

App = angular.module('app', ['templates', 'ngCookies', 'ngResource', 'app.controllers']);

App.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'pages/partials/intro.html'
    }).otherwise({
      redirectTo: '/404'
    });
    return $locationProvider.html5Mode(false);
  }
]).run();
