'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop')
  .controller('AboutCtrl', function ($scope) {
  	console.log("It is AboutCtrl");
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
