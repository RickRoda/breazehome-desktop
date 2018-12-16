'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:PasswordresetCtrl
 * @description
 * # PasswordresetCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop')
.controller('PasswordresetCtrl', function ($scope, $window, ModalService) {
    $window.location.href = '/#/landing';


    $scope.answerQuestion = {
        question : res.data.detail,
        answer : '',
      }

      ModalService.showModal({
        templateUrl: "views/modals/answer-question.html",
        controller: "LandingCtrl",
        scope: $scope
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {})
      })


	
});
