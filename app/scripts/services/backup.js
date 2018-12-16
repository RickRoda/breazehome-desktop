'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Backup
 * @description
 * # Service to get and update the backup config file
 * Backup service in the breazehomeDesktop.
 */
 
angular.module('breazehomeDesktop').factory('Backup', (BASE_URL, $http, $rootScope) => {
    return {
      get: () => {
        return $http({
          method: 'GET',
          url: `${BASE_URL}backup_config`,
          headers : { 'Content-Type': 'application/json' }
        })
      },
      put: (data) => {
        return $http({
          method: 'PUT',
          url: `${BASE_URL}backup_config`,
          data,
          headers : { 'Content-Type': 'application/json' }
        })
      }
    }
  }
)