'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.admin
 * @description
 * # admin
 * Factory in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop')
  .factory('Admin', function (BASE_URL, $http) {

    var meaningOfLife = 42;

    // Public API here
    return {
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Admin
      * @name getPolr
      * @returns {Promise} Return polr data
      * @description
      *   Get Polr
      */
      getSystemConfig: function (id) {
          return $http({
              method: 'GET',
              url: BASE_URL + 'configuration/1/',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(function successCallback(response) {
              return response;
          },
          function errorCallback(response) {
              console.log("Error: could not get system polr configuration", response);
              return response;
          });
      },
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Admin
      * @name setPolr
      * @returns {Promise} If Polr successfully set
      * @description
      *   Set Polr
      */
      setPolr: function (polrConfig) {
          return $http({
              method: 'PATCH',
              url: BASE_URL + 'configuration/1/',
              data: polrConfig,
              headers: { 'Content-Type': 'application/json' },
          }).then(function successCallback(response) {
              return response;
          },
          function errorCallback(response) {
              console.log("Error: could not get system polr configuration", response);
              return response;
          });
      },

      /**
       * @ngdoc method
       * @methodOf breazehomeDesktop.Admin
       * @name getPolr
       * @returns {Promise} Return polr data
       * @description
       *   Get Polr
       */
      getDefaultTab: function (id) {
        return $http({
          method: 'GET',
          url: BASE_URL + '/configuration/1/',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response) {
            return 1;
          },
          function errorCallback(response) {
            console.log("Error: could not get system polr configuration", response);
            return response;
          });
      }

    };
  });
