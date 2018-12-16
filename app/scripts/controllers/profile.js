'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:ProfileCtrl
 * @description
 * #ProfileCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop')
  .controller('ProfileCtrl', function ($scope, $rootScope, Users, Themes) {
    /*
    // Themes loader
    console.log($rootScope.user)

    if (typeof $rootScope.user != "undefined") {
      Themes.getUserTheme($rootScope.user.id).then((res) => {
        $rootScope.thisuserid = res.data;
        if ($rootScope.thisuserid.profile.userTheme != null) {
          Themes.getThemeById($rootScope.thisuserid.profile.userTheme).then((res) => {
            //console.log(res.data);
            $rootScope.appThemes = res.data;
            Themes.currentTheme = res.data;
            // elem.css("background-color", Themes.currentTheme.color_1);
          })
        }
      });
    }
    

    var user1 = $rootScope.user;
    console.log('loading  controller');
    $scope.firstName = 'John';
    $scope.lastName = 'Doe';
    $scope.fullname = $scope.firstName + ' ' + $scope.lastName;
    $scope.phone = '789-658-7854';
    $scope.gender = 'Male';
    $scope.email = 'johnemail@email.com';
    */
  });
