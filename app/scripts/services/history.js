'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.History
 * @description
 * # history
 * History service in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop')
  .factory('History', function ($rootScope) {

    // Public API here
    return {
      /**
      * @ngdoc property
      * @propertyOf breazehomeDesktop.History
      * @name searchesHistroy
      * @returns {Array} Language list
      * @description
      *   This property stores the searching history list.
      */
      searchesHistroy: [],

      /**
      * @ngdoc property
      * @propertyOf breazehomeDesktop.History
      * @name propertiesHistroy
      * @returns {Array} Language list
      * @description
      *   This property stores the viewed properties history list.
      */
      propertiesHistroy: [],
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.History
      * @name getHistory
      * @returns {Object} searchesHistroy and propertiesHistroy
      * @description
      *   This method will get the history from localstorage and return
      *   the searchesHistroy and propertiesHistroy to be used
      */
      getHistory: function() {
        if(window.localStorage.getItem('searches-histroy') != null
            && window.localStorage.getItem('searches-histroy') != ""
          ) {
          console.log(window.localStorage.getItem('searches-histroy'));
          this.searchesHistroy = window.localStorage.getItem('searches-histroy').split(",");
          $rootScope.history.searchesHistroy = this.searchesHistroy;
        }

        if(window.localStorage.getItem('properties-histroy') != null
            && window.localStorage.getItem('properties-histroy') != ""
          ) {
          this.propertiesHistroy = window.localStorage.getItem('properties-histroy').split(",");
          $rootScope.history.propertiesHistroy = this.propertiesHistroy;
        }

        return {
          searchesHistroy: this.searchesHistroy,
          propertiesHistroy: this.propertiesHistroy
        };
      },
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.History
      * @name getSearchesHistroy
      * @returns {Object} searchesHistroy
      * @description
      *   This method will get the searches history from localstorage and return
      *   the searchesHistroy to be used
      */
      getSearchesHistroy: function() {
        return this.searchesHistroy;
      },
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.History
      * @name getPropertiesHistroy
      * @returns {Object} propertiesHistroy and propertiesHistroy
      * @description
      *   This method will get the properties history from localstorage and return
      *   the propertiesHistroy to be used
      */
      getPropertiesHistroy: function() {
        return this.propertiesHistroy;
      },
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.History
      * @name pushSearchesHistroy
      * @param {Object} searchHistroy Search history obj
      * @description
      *   This method will push a new search history to local storage used by the app
      */
      pushSearchesHistroy: function(searchHistroy) {
        this.searchesHistroy.push(search);
        $rootScope.history.searchesHistroy = this.searchesHistroy;
        window.localStorage.setItem('searches-histroy', this.searchesHistroy);
      },
      
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.History
      * @name pushPropertiesHistroy
      * @param {Object} propertyHistroy Property history obj
      * @description
      *   This method will push a new property history to local storage used by the app
      */
      pushPropertiesHistroy: function(propertyHistroy) {
        // console.log(this.propertiesHistroy);
        // console.log($.inArray(propertyHistroy, this.propertiesHistroy));
        if($.inArray(propertyHistroy, this.propertiesHistroy) >= 0) {
          return;
        }
        this.propertiesHistroy.push(propertyHistroy);
        // console.log(this.propertiesHistroy);
        $rootScope.history.propertiesHistroy = this.propertiesHistroy;
        // console.log($rootScope.history.propertiesHistroy);
        window.localStorage.setItem('properties-histroy', this.propertiesHistroy);
        // console.log(typeof(window.localStorage.getItem('properties-histroy')));
      },

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.History
      * @name cleanHistory
      * @description
      *   This method will clean all history from local storage
      */
      cleanHistory: function() {
        this.searchesHistroy = [];
        $rootScope.history.searchesHistroy = this.searchesHistroy;
        window.localStorage.setItem('searches-histroy', this.searchesHistroy);
        // console.log(this.searchesHistroy);
        
        this.propertiesHistroy = [];
        $rootScope.history.propertiesHistroy = this.propertiesHistroy;
        window.localStorage.setItem('properties-histroy', this.propertiesHistroy);
        // console.log(this.propertiesHistroy);
      }
    };
  });
