'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Amenities
 * @description
 * # Service to manipulate and get Amenities from our API
 * Amenities service in the breazehomeDesktop.
 */

 angular.module('breazehomeDesktop').factory('Amenities', function (BASE_URL, $http, $rootScope) {

     return {
/*START Neighborhood Amenities : adubu002@fiu.edu*/

      //returns list of amenities based amenity category, longitude, and latitiude
      getAmenitiesByCategory: function (position, type) {
         return $http({
           method  :   'GET',
           url     :   BASE_URL+'search/',
           params  :   {
                        'longitude': position.lng,
                        'latitude': position.lat,
                        'categories': type,
           },
           headers :   { 'Content-Type': 'application/json' }
         }).then(function successCallback(response){
             console.log("Amenities: ", response)
             return response;
         },
         function errorCallback(response) {
             throw new Error('Could not get response from server');
         });
       },
/* END Neighborhood Amenities */

     };

   });
