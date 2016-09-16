'use strict';

var app = angular.module('microFbApp', ['ngRoute', 'LocalStorageModule']);

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

  $routeProvider.when('/profile/:id', {
    controller  : 'ProfileController',
    templateUrl : './static/js/views/profile.html'
  });


  $routeProvider.otherwise({ redirectTo: "/home" });
});
