'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Bilingual
 * @description
 * # Bilingual
 * Translation service in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop')
  .factory('Bilingual', function ($rootScope, $http, $localStorage) {
    return {
      /**
      * @ngdoc property
      * @propertyOf breazehomeDesktop.Bilingual
      * @name languageList
      * @returns {Array} Language list
      * @description
      *   This property stores the system supported translation language list.
      */
      languageList: ['English', 'Spanish'],

      /**
      * @ngdoc property
      * @propertyOf breazehomeDesktop.Bilingual
      * @name currentLanguage
      * @returns {String} Current selected language
      * @description
      *   This property is the current selected system translation language.
      */
      currentLanguage: 'English',
      
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Bilingual
      * @name getLanguageList
      * @returns {Array} Language list
      * @description
      *   This method will get the system supported translation language list.
      */
      getLanguageList: function() {
        return this.languageList;
      },

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Bilingual
      * @name changeLanguage
      * @description
      *   This method will set the current system language and call getLanguage method.
      */
      changeLanguage: function() {
        this.currentLanguage = (this.currentLanguage === this.languageList[0]) ? this.languageList[1] : this.languageList[0];
        this.getLanguage();
      },
      
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Bilingual
      * @name getLanguage
      * @param {string} title Language to user (English or Spanish)
      * @returns {Promise} The labels for the set language promise
      * @description
      *   This method will set the language used by the app and return
      *   the appropriate labels to be used.
      */
      getLanguage: function() {
        var languageTitle = this.languageList[this.currentLanguage];
        return $http({
          method  :   'GET',
          url     :   'scripts/translations/'+this.currentLanguage+'.json',
          headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response){
            // console.log("getLanguage params: ", title);
            // console.log("getLanguage response: ", response);
            var language = {
              title: languageTitle,
              content: response.data
            };

            $localStorage.language = language;
            // $localStorage.$save();
            $rootScope.$broadcast('languageChanged', []);

            // console.log($localStorage.language);
            return response;
        },
          function errorCallback(response) {
            console.log("Could not find language JSON file");
        });
      }
    };
  });
