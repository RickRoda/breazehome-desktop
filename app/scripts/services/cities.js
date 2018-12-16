

/**
 * @ngdoc service
 * @name breazehomeDesktop.Cities
 * @description
 * # Cities
 * Factory in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop')
  .factory('Cities', function ($rootScope, $http, $localStorage) {
    // Service logic
    // ...

    // Public API here
    return {
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.Cities
      * @name getCity
      * @returns {Object} The labels for the set language
      * @description
      *   This method will set the language used by the app and return
      *   the appropriate labels to be used
      */
      getCity: function() {
        return $http({
          method  :   'GET',
          url     :   'scripts/dictionaries/Cities.json',
          headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response){
            console.log("getCity params: ", title);
            console.log("getCity response: ", response);
            var language = {
              //title: languageTitle,
              //content: response.data
            };

            //$localStorage.language = language;
            // $localStorage.$save();
            //$rootScope.$broadcast('languageChanged', []);

            // console.log($localStorage.language);
            return response;
        },
          function errorCallback(response) {
            console.log("Could not find language JSON file");
        });
      }
    };
  });
