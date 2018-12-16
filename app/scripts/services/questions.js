'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Questions
 * @description
 * # Manipulate, edit, get User info
 * Factory in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop').factory('Questions', function ($http, BASE_URL, $rootScope) {
    return {

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Questions
      * @name getQuestions
      * @returns {Object} The list of questions
      * @description
      */
      getQuestions: function() {
        return $http({
            method  :   'GET',
            url     :   BASE_URL+'securityquestion/',
            headers :   { 'Content-Type': 'application/json' },
          }).then(function successCallback(response){
              return response;
          },
          function errorCallback(response) {
              return response;
          });
      }



   };
});