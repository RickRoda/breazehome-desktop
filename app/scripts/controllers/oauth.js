'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:OauthCtrl
 * @description
 * # OauthCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop')
.controller('OauthCtrl', function ($scope, $location) {
    console.log($location.path());
});
