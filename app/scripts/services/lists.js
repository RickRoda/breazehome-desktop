'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Lists
 * @description
 * # Factory functions for lists endpoint. 
 * Factory in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop')
  .factory('Lists', function (BASE_URL, $rootScope, $http) {
    return {

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Lists
      * @name getAll
      * @returns {Promise} The promise contains lists user saved
      * @description
      *   Get all lists user saved.
      */
      getAll: function () {

        if($rootScope.hasOwnProperty("user")){
          var USER_ID = $rootScope.user.id;
        }

        return $http({
          method  :   'GET',
          url     :   BASE_URL+'users/'+USER_ID+'/lists/',
          headers :   { 'Content-Type': 'application/json' }
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        }); 
      },

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Lists
      * @name addPropertyToList
      * @param {string} propertyId Property ID
      * @param {object} list List with list ID
      * @description
      *   Add property to existing list.
      */
      addPropertyToList: function (propertyId, list) {

        if($rootScope.hasOwnProperty("user")){
          var USER_ID = $rootScope.user.id;
        }

        return $http({
          method  :   'PUT',
          url     :   BASE_URL+'users/'+USER_ID+'/lists/'+list.id+'/',
          headers :   { 'Content-Type': 'application/json' },
          data: list
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        }); 
      },

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Lists
      * @name create
      * @param {object} params Object contains user info
      * @description
      *   Create new list.
      */
      create: function (params) {

        if($rootScope.hasOwnProperty("user")){
          var USER_ID = $rootScope.user.id;
          params.user = USER_ID
        }

        return $http({
          method  :   'POST',
          url     :   BASE_URL+'users/'+USER_ID+'/lists/',
          headers :   { 'Content-Type': 'application/json' },
          data: params
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        }); 
      }
    };
  });
