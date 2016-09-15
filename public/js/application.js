'use strict';

var app = angular.module('microFbApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/login', {
    controller  : 'LoginController',
    templateUrl : './static/js/views/login.html'
  });

  $routeProvider.when('/register', {
    controller  : 'RegisterController',
    templateUrl : './static/js/views/register.html'
  });

  $routeProvider.when('/home', {
    controller  : 'HomeController',
    templateUrl : './static/js/views/home.html'
  });

  $routeProvider.otherwise({ redirectTo: "/home" });
});
