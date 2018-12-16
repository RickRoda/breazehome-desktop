'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Admincard
 * @description
 * # Directive to show a card on the admin dashboard
 */

angular.module('breazehomeDesktop').directive('admincard', () => {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      ctitle: '=ctitle',
      subtitle: '=subtitle',
      icon: '=icon',
      external: '=external',
      color: '=color',
      href: '=href'
    },
    templateUrl: "views/admincard.html"
  }
})