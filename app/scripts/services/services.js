'use strict';
/**
 * @ngdoc service
 * @name breazehomeDesktop.services
 * @description
 * # services
 * Service in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop.services', [])

//BEGIN PoLR utility function implementation
.factory('Polygons', function (Utilities) {
    return {

        getStringifiedIsochrone: function (isochrone, stringFormat, elementDelimiter, listDelimiter) {  //simple helper for turning an array of isochrone polygon coordinates into a string representation

            var stringifiedIsochrone = "";
            var iterator = 0;

            switch (stringFormat.toUpperCase()) {
                case SETTINGS.POLR_ISOCHRONE_STRINGIFICATION_GEOSGEOMETRY:  
                    for (iterator = 0; iterator < isochrone.length; iterator++) {
                        //GEOSGeometry likes coordinates in the form of longitude/latitude, so we reverse() the array elements, slice()'ing them before doing so to not change the values in the original elements because Array objects are by reference
                        stringifiedIsochrone += iterator == isochrone.length - 1 ? isochrone[iterator].slice(0).reverse().join(elementDelimiter) : isochrone[iterator].slice(0).reverse().join(elementDelimiter) + listDelimiter;
                    }
                    break;
                default:
                    for (iterator = 0; iterator < isochrone.length; iterator++) {
                        stringifiedIsochrone += iterator == isochrone.length - 1 ? isochrone[iterator].join(elementDelimiter) : isochrone[iterator].join(elementDelimiter) + listDelimiter;
                    }
            }

            return stringifiedIsochrone;
        }
    };
})

.factory('Utilities', function () {

    return {

        getNextFutureArrivalDateAndTime: function (arrivalDay, arrivalTime) {  //a simple helper for calculating a date in ms since 1970 for when that next day of the week and time of the day will occur

            var daysToNextArrivalDay = 0;
            var arrivalDate = new Date();
            var timelessArrivalDate;
            var datelessArrivalTime;
            var today = new Date();

            daysToNextArrivalDay = today.getDay() == arrivalDay ? 7 : today.getDay() > arrivalDay ? 7 + (arrivalDay - today.getDay()) : arrivalDay - today.getDay();
            arrivalDate.setDate(arrivalDate.getDate() + daysToNextArrivalDay);
            timelessArrivalDate = new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate());

            SETTINGS.VERBOSE_CONSOLE_DEBUG ? console.log("getNextFutureArrivalDateAndTime() := timelessArrivalDate == [%s], futureArrivalDateAndTime == [%d], futureArrivalDateAndTime == [%s]", timelessArrivalDate, timelessArrivalDate.getTime() + arrivalTime.getTime() - timelessArrivalDate.getTimezoneOffset() * 60 * 1000, new Date(timelessArrivalDate.getTime() + arrivalTime.getTime() - timelessArrivalDate.getTimezoneOffset() * 60 * 1000)) : null;
            
            return timelessArrivalDate.getTime() + arrivalTime.getTime() - timelessArrivalDate.getTimezoneOffset() * 60 * 1000;
        }
    };
})
//END PoLR utility function implementation

.factory('Query', function($http, BASE_URL){
  return {

    /*
  * @ngdoc object
  * @name Card
  * @property {Object} Abaad prop 
  * @property {Object} Address prop
  * @property {Object} Alley prop
  * @property {Object} AnbariNumber prop
  * @property {Object} ArchitectureTypeL prop
  * @property {Object} Backyard prop
  * @property {Object} BasementArea prop
  * @property {Object} BuildingFloorNumber prop
  * @property {Object} BuildingNamaTypeID prop
  * @property {Object} BuldingAge prop
  * @property {Object} BuldingUnitNumber prop
  * @property {Object} Bystreet1 prop
  * @property {Object} Bystreet2 prop
  * @property {Object} Code prop
  * @property {Object} ComputedAreaNumber prop
  * @property {Object} ContinueAddress prop
  * @property {Object} CreatorID prop
  * @property {Date} Date prop
  * @property {Object} District prop
  * @property {Object} Ertefa prop
  * @property {Object} Eslahi prop
  * @property {Object} EstateDirectionID prop
  * @property {Object} EstateDocumentTypeID prop
  * @property {Object} EstatePropertyID prop
  * @property {Object} EstateUnitNumber prop
  * @property {String} FileDescription prop
  * @property {Int} FileTypeID prop
  * @property {Object} FirstName prop
  * @property {Object} Floor prop
  * @property {Object} FolderNumber prop
  * @property {Object} GeographicalLocationID prop
  * @property {Object} HomePhone prop
  * @property {Object} HomePhone2 prop
  * @property {Object} ISMostakhdemService prop
  * @property {Object} LastName prop
  * @property {Object} MainStreet1 prop
  * @property {Object} MainStreet2 prop
  * @property {Object} MasahatKolZamin prop
  * @property {Object} MobilePhone prop
  * @property {Object} MobilePhone2 prop
  * @property {Object} Note prop
  * @property {Object} OwnerID prop
  * @property {Object} PVDate prop
  * @property {Object} ParkingNumber prop
  * @property {Object} Plaque prop
  * @property {Object} PoolTypeID prop
  * @property {Object} PostalCode prop
  * @property {Object} PrePhone prop
  * @property {Object} PrePhone2 prop
  * @property {Object} PreTelNumber prop
  * @property {Int} Priority prop
  * @property {Object} RequestTypeID prop
  * @property {Object} SourceTypeID prop
  * @property {Int} Status prop
  * @property {Object} StatusOwnerTypeID prop
  * @property {Object} StatusTypeID prop
  * @property {Object} Tarakom prop
  * @property {Object} TblRESEstateAdditionalInformation prop
  * @property {Object} TblRESEstateCard prop
  * @property {Object} TblRESEstateDetail prop
  * @property {Object} TblRESEstateKitchenTypeL prop
  * @property {Object} TblRESEstatePropertyTypeL prop
  * @property {Object} TblRESUsage prop
  * @property {Object} TblSHRRequestTypeL prop
  * @property {Object} TblSHRZone prop
  * @property {Object} TelNumber prop
  * @property {Object} TotalValue prop
  * @property {Object} UnitNumber prop
  * @property {Object} UnitPrice prop
  * @property {Object} UsageID prop
  * @property {Int} UserID prop
  * @property {Object} ValueEjareh prop
  * @property {Object} ValueVadieh prop
  * @property {Object} WallTypeID prop
  * @property {Object} YardTypeID prop
  * @property {Object} ZoneID prop
  * @property {Int} id prop
    */

    /*
    * @ngdoc method
    * @methodOf breazehomeDesktop.services
    * @name getQuery
    * @param {Object} queryParams Object of constraints for a query to match
  * @param {String} queryParams.Address property detail
  * @param {Int} queryParams.AgeFrom  property detail
  * @param {String} queryParams.AgeTo property detail
  * @param {Boolean} queryParams.Anbari property detail
  * @param {Int} queryParams.AreaMeterFrom property detail
  * @param {Int} queryParams.AreaMeterTo property detail
  * @param {String} queryParams.AssemblyHall property detail
  * @param {String} queryParams.Barbecue property detail
  * @param {String} queryParams.BedRoomFrom property detail
  * @param {String} queryParams.BedRoomTo property detail
  * @param {String} queryParams.Carwash property detail
  * @param {String} queryParams.CentralAntenna property detail
  * @param {String} queryParams.CentralSatellite property detail
  * @param {String} queryParams.CentralVacuum property detail
  * @param {String} queryParams.Custodian property detail
  * @param {Boolean} queryParams.Elevator property detail
  * @param {String} queryParams.FileDateFrom property detail
  * @param {String} queryParams.FileDateTo property detail
  * @param {String} queryParams.FireAlarm property detail
  * @param {String} queryParams.FireFighting property detail
  * @param {String} queryParams.Fireplaces property detail
  * @param {Int} queryParams.FloorsFrom property detail
  * @param {String} queryParams.FloorsTo property detail
  * @param {String} queryParams.Gym property detail
  * @param {String} queryParams.Jacuzzi property detail
  * @param {String} queryParams.Laundry property detail
  * @param {String} queryParams.Lobby property detail
  * @param {String} queryParams.MasterRoom property detail
  * @param {String} queryParams.Method property detail
  * @param {String} queryParams.PageIndex  property detail
  * @param {String} queryParams.PanelFit property detail
  * @param {Boolean} queryParams.Parking property detail
  * @param {String} queryParams.Patio property detail
  * @param {Boolean} queryParams.Pool property detail
  * @param {Int} queryParams.PositionID property detail
  * @param {Int} queryParams.PriceMax property detail
  * @param {Int} queryParams.PriceMin property detail
  * @param {String} queryParams.PropertyTypeIDs property detail
  * @param {String} queryParams.RemoteParking property detail
  * @param {String} queryParams.RequestTypeIDs  property detail
  * @param {String} queryParams.RoofGarden property detail
  * @param {String} queryParams.Sauna property detail
  * @param {String} queryParams.Sentry property detail
  * @param {String} queryParams.Shooting property detail
  * @param {String} queryParams.Surveillance property detail
  * @param {String} queryParams.TheftAlarm property detail
  * @param {String} queryParams.UPS property detail
  * @param {Int} queryParams.UserID property detail
  * @param {String} queryParams.ZoneAreaIDs property detail
  * @param {Int} queryParams.ZoneID property detail
  * @param {Int} queryParams.offset property detail
    * @returns {services.Query.Card} Card
    * @description
    *   This method will set the language used by the app labels and return
  */

    getQuery: function(queryParams){
      return $http({
        method  : 'POST',
        url     : BASE_URL+'/search',
        data    : $.param(queryParams),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
       }).then(function successCallback(response) {
        console.log('query');
        console.log("getQuery params: ", queryParams);
        console.log("getQuery response: ", response);
        return response;
      }, function errorCallback(response) {
        return response;
      });
    },

    /*
    * @ngdoc method
    * @methodOf breazehomeDesktop.services
    * @name getQuery
    * @param {Object} title Language to user (English or Farsi)
    * @returns {Object} The labels for the set language
    * @description
    *   This method will set the language used by the app labels and return
  */

    getCardsWithStatus: function(queryParams){
      return $http({
        method  : 'POST',
        url     : BASE_URL+'/statusSearch',
        data    : $.param(queryParams),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
       }).then(function successCallback(response) {
        console.log("getCardsWithStatus params: ", queryParams);
        console.log("getCardsWithStatus response: ", response);
        return response;
      }, function errorCallback(response) {
        console.log("Error. Could not connect to server", response);
      });
    },

    /*
    * @ngdoc method
    * @methodOf breazehomeDesktop.services
    * @name getQuery
    * @param {Object} title Language to user (English or Farsi)
    * @returns {Object} The labels for the set language
    * @description
    *   This method will set the language used by the app labels and return
  */

    getAllCards: function(queryParams){
      return $http({
        method  : 'POST',
        url     : BASE_URL+'/statusSearch',
        data    : $.param(queryParams),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
       }).then(function successCallback(response) {
           console.log("getAllCards params: ", queryParams);
           console.log("getAllCards response: ", response);
        return response;
      }, function errorCallback(response) {
        console.log("Error. Could not connect to server", response);
      });
    }

  };

})

/*
* @ngdoc object
* @name services.Cards
* @requires $http
* @description
*   Set of API functions specific to retreiving and manipulating Card data
*
*/

.factory('Cards', function($http, BASE_URL){


  return {

    /*
    * @ngdoc method
    * @methodOf breazehomeDesktop.services
    * @name getCards
    * @param {Object} cardParams Card parameters
    * @returns {Object} Cards for a specific user
    * @description
    *   Return all cards for a specific user
  */

    getCards: function(cardParams){
      return $http({
        method  : 'POST',
        url     : BASE_URL+'/getUserCards',
        data    : $.param(cardParams),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded',
                    'UserName': '',
                    'Password': ''
                  }
       }).then(function successCallback(response) {
           console.log("getCards params: ", cardParams);
           console.log("getCards response: ", response);
        return response;
      }, function errorCallback(response) {
        console.log("Could not connect to server: ", response);
        return response;
      });
    },

    /*
    * @ngdoc method
    * @methodOf breazehomeDesktop.services
    * @name addCard
    * @param {Object} cardParams Card parameters
    * @returns {Object} Something will find out later
    * @description
    *    Method to add a card or update an existing card
  */

    addCard: function(cardParams){
      console.log(cardParams);
      return $http({
        method  : 'POST',
        url     : BASE_URL+'/addUserCard',
        data    : $.param(cardParams),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded',
                    'UserName': '',
                    'Password': ''
                  }
       }).then(function successCallback(response) {
        //console.log("Successfully added/updated card: ", response);
        console.log("addCard params: ", cardParams);
        console.log("addCard response: ", response);
        return response;
      }, function errorCallback(response) {
        console.log("Could not connect to server: ", response);
        Popups.showPopup("The server is not available at this time. Please try again");
        return response;
      });
    }

  };
})

/*
* @ngdoc object
* @name services.Themes
* @requires $http
* @description
*   Set of API functions specific to retreiving and manipulating themes
*
*/

// .factory('Themes', function($http, BASE_URL){


  // return {

    /*
    * @ngdoc method
    * @methodOf breazehomeDesktop.services
    * @name getAllThemes
    * @returns {Object} array of themes
    * @description
    *   Return list of global themes 
  */

    // getAllThemes: function(){
    //   return $http ({
    //     method  : 'POST',
    //     url     : BASE_URL+'/getThemes',
    //     data    : '',
    //     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    //   }).then(function successCallback(response) {
    //     return response;
    //   },
    //   function errorCallback(response) {
    //     console.log("Error: could not get themes", response);
    //     return response;
    //   });
    // },

  // };
// })

