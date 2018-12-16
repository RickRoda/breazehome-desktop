'use strict';
var app = angular.module('breazehomeDesktop');
/**
 * @ngdoc directive
 * @name breazehomeDesktop.directive:header
 * @description
 * # header
 */
// START #2357 and #2487 Andreina Rojas aroja108@fiu.edu
app.directive('breazeHeader', function ($rootScope, $localStorage,$location, Bilingual, History, Users, Chat, Properties) {
// END #2357 and #2487 Andreina Rojas aroja108@fiu.edu
	return {
      templateUrl: 'views/header.html',
      replace: true,
      restrict: 'E',
      scope: {

      },
      link: function postLink(scope, element, attrs) {
	    scope.user = $rootScope.user;

        // Get default language
        Bilingual.getLanguage('English').then( res => {
	      	$rootScope.storage = $localStorage
	      	scope.storage = $localStorage
        })

        // Switch language
        scope.switchLanguage = function () {
            Bilingual.changeLanguage()
        }
      	
        scope.history = History.getHistory()

        
        // START #2357 and #2487 Andreina Rojas aroja108@fiu.edu      
        
        scope.clickBoard = function() {
        	window.location.href = "/#/allboards/";
        }
        
        
        
        scope.resultsFav = function() {
        	window.location.href = "/#/resultsfav/";
        	window.location.reload();
        }
        
        // END #2357 and #2487 Andreina Rojas aroja108@fiu.edu

        // Global login functions
	    scope.loginParams = {}
	    // Attempt to login user
		scope.login = function() {
			scope.loginParams.email = scope.loginParams.username;
			Users.login(scope.loginParams).then(res => {
				console.log(res)
				// Successful login, set auth token and get user
				if (res.status === 200) {
				  scope.loginParams = {};
				  const token = res.data.key;
				  Users.setAuthToken(token);
				  Users.get().then(res => {
				    $rootScope.user = res.data;
				    scope.user = res.data;
				    Chat.connectToSocket().then(() => {
				      Chat.connectToChannel('lobby').then((channel) => {
				        $rootScope.lobbyMessages = Chat.getMessages();
				        $rootScope.lobbyChannel = channel;
				        $window.location.href = '/#/results';
				      })
				    })
				  })
				}
				// Unsuccessful login, show error modal
				else {
				    scope.loginParams = {};
				    $rootScope.loginError = res.data;
				    ModalService.showModal({
				        templateUrl: "views/modals/login-incorrect.html",
				        controller: "AboutCtrl",
				        scope: $rootScope
				    }).then(function (modal) {
				        modal.element.modal();
				        modal.close.then(function (result) { });
				    });
				}
			})
		}
		// Create global logout function
	    scope.logout = function() {
	      Users.logout().then(res => {
	        $rootScope.lobbyMessages = [];
	        $rootScope.lobbyChannel = null;
	        window.location.href = '/#/landing';
	      })
	    }


		// Load saved searches
		// $rootScope.savedSearches = [];
		Users.getSavedSearches().then(function(res) {
		  if (res !== -1) {
		    $rootScope.savedSearches = res.data.results.slice(0, 5);
		  } else {
		    $rootScope.savedSearches = [];
		  }
		});
      }
    };
  });