'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Themes
 * @description
 * # Themes
 * Themes service in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop')
  .factory('Themes', function ($rootScope, $http, $localStorage, BASE_URL) {
    return {
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Themes
      * @name getAllThemes
      * @returns {Promise} All the themes promise
      * @description
      *   Return list of global themes 
      */
        selectedTheme: {
            "themeName": "New Theme",
            "color_1": "",
            "color_2": "",
            "color_3": "",
            "color_4": "",
            "color_5": "",
            "color_6": "",
            "image": "true"
        },
        currentTheme: {
            "themeName": "New Theme",
            "color_1": "",
            "color_2": "",
            "color_3": "",
            "color_4": "",
            "color_5": "",
            "color_6": "",
            "image": "true"
        },
        isNewTheme: null,
      
      getAllThemes: function(){
        return $http ({
          method  : 'GET',
          url     : BASE_URL+'/theme/',
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response) {
          return response;
        },
        function errorCallback(response) {
          console.log("Error: could not get themes", response);
          return response;
        });
        },

      getThemeById: function (id) {
          if(id === null) {
            return
          }
          return $http({
              method: 'GET',
              url: BASE_URL + '/theme/' + id,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(function successCallback(response) {
              return response;
          },
          function errorCallback(response) {
              console.log("Error: could not get themes", response);
              return response;
          });
      },
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Themes
      * @name deleteTheme
      * @returns {Promise} If theme successfully deteled
      * @description
      *   Delete theme
      */
      deleteTheme: function(themeID) {
        return $http ({
          method  : 'DELETE',
          url     : BASE_URL+'/theme/'+themeID+'/',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response) {
          return response;
        },
        function errorCallback(response) {
          return response;
        });
      },
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Themes
      * @name createTheme
      * @returns {Promise} If theme successfully created
      * @description
      *   Create theme
      */
      createTheme: function(theme) {
        return $http ({
          method  : 'POST',
          url     : BASE_URL+'/theme/',
          headers : { 'Content-Type': 'application/json' },
          data: theme
        }).then(function successCallback(response) {
          return response;
        },
        function errorCallback(response) {
          return response;
        });
      },
      setTheme: function (themeID) {
          return $http({
              method: 'GET',
              url: BASE_URL + '/themes/' + themeID + '/',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(function successCallback(response) {
              console.log(response);
              return response;
          },
              function errorCallback(response) {
                  console.log("not working");
                  return response;
              });
      },
      copyTheme: function (themeID) {
          return $http({
              method: 'GET',
              url: BASE_URL + '/themes/' + themeID + '/',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(function successCallback(response) {
              console.log(response);
              return response;
          },
              function errorCallback(response) {
                  console.log("not working");
                  return response;
              });
      },
      editTheme: function (theme, themeID) {
          return $http({
              method: 'PUT',
              url: BASE_URL + '/themes/' + themeID + '/',
              headers: { 'Content-Type': 'application/json' },
              data: theme
          }).then(function successCallback(response) {
              console.log(response);
              return response;
          },
              function errorCallback(response) {
                  console.log("not working");
                  return response;
              });
      },
      applyTheme: function (uid, themeId) {
          return $http({
              method: 'PATCH',
              url: BASE_URL + '/configuration/1/',
              headers: { 'Content-Type': 'application/json' },
              data: {
                  "systemTheme": themeId
              }
          }).then(function successCallback(response) {
              console.log("Set the user theme here");
              return response;
          },
              function errorCallback(response) {
                  console.log("not working");
                  return response;
              });
      },
      applyDefaultTheme: function () {
          return $http({
              method: 'PATCH',
              url: BASE_URL + '/configuration/1/',
              headers: { 'Content-Type': 'application/json' },
              data: {
                  "systemTheme": null
              }
          }).then(function successCallback(response) {
              console.log("Set the user theme here");
              return response;
          },
              function errorCallback(response) {
                  console.log("not working");
                  return response;
              });
      },
      getUserTheme: function (uid) {
          return $http({
              method: 'GET',
              url: BASE_URL + 'users/' + uid + '/',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }      
          }).then(function successCallback(response) {
              //console.log(response);
              return response;
          },
              function errorCallback(response) {
                  console.log("not working");
                  return response;
              });
      } 
    };
  });
