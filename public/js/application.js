'use strict';

var app = angular.module('microFbApp', ['ngRoute', 'LocalStorageModule', 'angular-jwt']);


app.config(function($routeProvider, $httpProvider, jwtOptionsProvider) {
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

  $routeProvider.when('/members', {
    controller  : 'MembersController',
    templateUrl : './static/js/views/members.html'
  });

  $routeProvider.when('/profileedit', {
    controller  : 'ProfileEditController',
    templateUrl : './static/js/views/profileedit.html'
  });

  $routeProvider.when('/messages', {
    controller  : 'MessagesController',
    templateUrl : './static/js/views/messages.html'
  });

  $routeProvider.when('/mailbox', {
    controller  : 'MailboxController',
    templateUrl : './static/js/views/mailbox.html'
  });

  $routeProvider.otherwise({ redirectTo: "/home" });

  // JWT Config
  jwtOptionsProvider.config({
      tokenGetter: ['localStorageService', function(localStorageService) {
        var user = localStorageService.get('user');
        if (user) return user.token;
        return null;
      }],
      unauthenticatedRedirector: ['$location', function($location) {
        $location.path('/login');
      }]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
});
