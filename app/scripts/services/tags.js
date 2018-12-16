'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Tags
 * @description
 * # Factory functions for tags endpoint. 
 * Factory in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop').factory('Tags', function (BASE_URL, $rootScope, $http) {

    return {

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Tags
      * @name getAll
      * @returns {Promise} The promise contains all user's tags
      * @description
      *   Get all tags for user.
      */
      getAll: function () {
        if($rootScope.hasOwnProperty("user")){
          var USER_ID = $rootScope.user.id;
        }

        return $http({
          method  :   'GET',
          url     :   BASE_URL+'users/'+USER_ID+'/tags/',
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
      * @methodOf breazehomeDesktop.Tags
      * @name delete
      * @param {string} tagId Tag ID
      * @returns {Promise} The promise if tag successfully deleted
      * @description
      *   Delete tag.
      */
      delete: function (tagId) {

        if($rootScope.hasOwnProperty("user")){
          var USER_ID = $rootScope.user.id;
        }

        return $http({
          method  :   'DELETE',
          url     :   BASE_URL+'users/'+USER_ID+'/tags/'+tagId+'/',
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
      * @methodOf breazehomeDesktop.Tags
      * @name getPropTags
      * @param {string} propID Property ID
      * @returns {Promise} The promise contains all tags of a property
      * @description
      *   Get all the public tags for a property.
      */
      getPropTags: function (propID) {
        return $http({
          method  :   'GET',
          url     :   BASE_URL+'properties/'+propID+'/tags/',
          headers :   { 'Content-Type': 'application/json' }
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        }); 
      }

    };
  });
