'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Users
 * @description
 * # Manipulate, edit, get User info
 * Factory in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop').factory('Users', function ($http, BASE_URL, $rootScope) {
    return {

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Users
      * @name login
      * @param {object} params User info for login
      * @returns {Promise} The promise if login successfully
      * @description
      *   Login User.
      */
      login: function (params) {
        return $http({
          method  :   'POST',
          url     :   BASE_URL+'auth/login/',
          headers :   { 'Content-Type': 'application/json' },
          data: params
        }).then(function successCallback(response){
            if(response.status === 200){
              window.localStorage.setItem('user_key', response.data.key);
              $http.defaults.headers.common['Authorization'] = response.data.key;
            }
            return response;
        },
        function errorCallback(response) {
            return response;
        }); 
      },

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Users
      * @name register
      * @param {object} params User info for signup
      * @returns {Promise} The promise if regist successfully
      * @description
      *   Register User.
      */
      register: function (params) {
        return $http({
          method  :   'POST',
          url     :   BASE_URL+'auth/register/',
          headers :   { 'Content-Type': 'application/json' },
          data: params
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        });
      },

      // Create user saved list
      createSavedList: function (uid) {
        return $http({
          method  :   'POST',
          url     :   BASE_URL+'users/'+uid+'/list/',
          headers :   { 'Content-Type': 'application/json' },
          data: {
            "title": "saved",
            "user": uid
          }
        }).then(function successCallback(response){
            console.log(response);
            return response;
        },
        function errorCallback(response) {
            return response;
        });
      },      

      // Set Auth Token for all future requests
      setAuthToken: function (token) {
        $http.defaults.headers.common['Authorization'] = `Token ${token}`;
      },

      // Get user profile, check localStorage first
      get: function () {
        if(window.localStorage.getItem("user_data") !== null) {
          return new Promise(function(resolve, reject){
            resolve(JSON.parse(window.localStorage.getItem('user_data')));
          })
        }

        return $http({
          method  :   'GET',
          url     :   BASE_URL+'auth/user/' + '?v=' + Math.random(),
          headers :   { 'Content-Type': 'application/json'},
        }).then(function successCallback(response){
          window.localStorage.setItem("user_data", JSON.stringify(response.data));
          return response;
        },
        function errorCallback(response) {
            throw new Error('Could not get response from server');
            return response;
        });
      },

      // Logout user
      logout: function () {
        return $http({
          method  :   'POST',
          url     :   BASE_URL+'auth/logout/',
          headers :   { 'Content-Type': 'application/json' },
          data: {}
        }).then(function successCallback(response){
          delete $http.defaults.headers.common['Authorization'];
          delete $rootScope['user'];
          window.localStorage.removeItem('user_key');
          window.localStorage.removeItem('user_data');
          return response;
        },
        function errorCallback(response) {
            throw new Error('Could not get response from server');
            return response;
        });
      },

      // Reser user password. Sends an email to confirm.
      resetPassword: function (email) {
        return $http({
          method  :   'POST',
          url     :   BASE_URL+'account/reset_password',
          headers :   { 'Content-Type': 'application/json' },
          data: {email: email}
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        });
      },

      getSavedSearches: function() {
        if(!$rootScope['user']) {
          return new Promise(function(resolve, reject){
            resolve(-1);
          }) 
        }
        return $http({
          method  :   'GET',
          url     :   BASE_URL+'users/'+$rootScope['user'].id+'/searches/',
          // url     :   BASE_URL+'users/'+$rootScope['user']+'/searches/',
          headers :   { 'Content-Type': 'application/json' },
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        });
      },

    /**
     * @name #2491 Ronny Alfonso ralfo040@fiu.edu
     * @param userInfo, dictionary with email, question id, answer
     * @description This is used to send a POST to the back-end to confirm that the user 
     * trying to reset the password is the one who originally registered the account
     */
    confirmToken: function(userInfo){
      return $http({
        method  : 'POST',
        url     : BASE_URL + 'user/confirm_token/',
        headers :   { 'Content-Type': 'application/json' },
        data    : userInfo
      }).then(function successCallback(response){
          return response;
      },
      function errorCallback(response) {
          return response;
      });
    },
    // END #2491

    /**
     * @name #2491 Ronny Alfonso ralfo040@fiu.edu
     * @param userInfo, dictionary with email, question id, answer
     * @description This is used to send a POST to the back-end to confirm that the user 
     * trying to reset the password is the one who originally registered the account
     */
      confirmAnswer: function(userInfo){
        return $http({
          method  : 'POST',
          url     : BASE_URL + 'user/confirm_answer/',
          headers :   { 'Content-Type': 'application/json' },
          data    : userInfo
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        });
      },
      // END #2491

    /**
     * @name #2491 Ronny Alfonso
     * @param emailPasswords, dictionary with email, password, pasword2
     * @description This is used to send a POST to the back-end to change the password
     * the user should be confirmed first
     */
      changePassword: function(emailPasswords){
        return $http({
          method  : 'POST',
          url     : BASE_URL + 'account/password_reset_change/',
          headers :   { 'Content-Type': 'application/json' },
          data    : emailPasswords 
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        });
      },
      // END #2491

      /**
     * @name #2491 Ronny Alfonso
     * @param emailPasswords, dictionary with email, password, pasword2
     * @description This is used to send a POST to the back-end to change the password
     * the user should be confirmed first
     */
      getQuestion: function(email){
        return $http({
          method  : 'POST',
          url     : BASE_URL + 'user/get_question/',
          headers :   { 'Content-Type': 'application/json' },
          data    : email 
        }).then(function successCallback(response){
            return response;
        },
        function errorCallback(response) {
            return response;
        });
      }
      // END #2491


    };
});
