'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.oauth
 * @description
 * # oauth services
 * Oauth service in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop')
  .factory('oauth', function ($http, AUTH_REDIRECT_URL_GOOGLE, AUTH_REDIRECT_URL_FB, BASE_URL) {

    let auth_urls = {
      google: 'https://accounts.google.com/o/oauth2/auth?client_id=81021899393-jvj3ju77ac02pro1ijbdgeg2g7eku1gr.apps.googleusercontent.com',
      facebook: ''
    }

    return {
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.oauth
      * @name authenticate
      * @param {string} provider Provider name
      * @returns {Promise} The promise contains user crendential
      * @description
      *   Attempt authentication via provider OAuth endpoint.
      */
      authenticate: function (provider) {
        return $http({
          method  :   'GET',
          url     :   auth_urls.google+`&redirect_uri=${AUTH_REDIRECT_URL_GOOGLE}`+`&scope=email&response_type=code&state=MTOxKcYdKpyf&from_login=1&as=14cfc7aace49b1bb&authuser=1`,
          headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response){
            console.log(response)
            return response;
        },
        function errorCallback(response) {
            throw new Error('Could not get response from provider server');
        });
      },

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.oauth
      * @name createUser
      * @param {string} token Token string
      * @param {string} provider Provider name
      * @returns {Promise} The promise if register succuss
      * @description
      *   Attempt to create a user via oauth token.
      */
      createUser: function (token, provider) {

        if(provider === 'google'){
          return $http({
            method  :   'POST',
            url     :   `${BASE_URL}auth/google/`,
            headers :   { 'Content-Type': 'application/json' },
            data    : {
              "code": token,
              "redirect_uri": AUTH_REDIRECT_URL_GOOGLE
            }
          }).then(function successCallback(response){
              return response;
          },
          function errorCallback(response) {
              return response;
              throw new Error('Could not get response from provider server');
          });  
        }

        else if(provider === 'facebook'){
          return $http({
            method  :   'POST',
            url     :   `${BASE_URL}auth/facebook/`,
            headers :   { 'Content-Type': 'application/json' },
            data    : {
              "code": token,
              "redirect_uri": AUTH_REDIRECT_URL_FB
            }
          }).then(function successCallback(response){
              return response;
          },
          function errorCallback(response) {
              return response;
              throw new Error('Could not get response from provider server');
          });  
        }

        
      },
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.oauth
      * @name getUser
      * @returns {Promise} The promise contains user info
      * @description
      *   Attempt to get the user data.
      */
      getUser: function () {
        return $http({
          method  :   'GET',
          url     :   `${BASE_URL}auth/user/`,
          headers :   { 'Content-Type': 'application/json' }
        }).then(function successCallback(response){
            console.log(response);
            window.localStorage.setItem('user_data', JSON.stringify(response.data));
            return response;
        },
        function errorCallback(response) {
            throw new Error('Could not get response from provider server');
        });
      }
    };
  });
