// START #2357 and #2487 Andreina Rojas aroja108@fiu.edu
'use strict';

/*
 * @ngdoc controller
 * @name breazehomeDesktop.controller: AllBoardsCtrl
 * @description
 * # AllBoardsCtrl
 * Controller of the breazehomeDesktop
 */

angular.module('breazehomeDesktop').controller('PropsToBoardCtrl', function ($scope, $location, $localStorage, $document, Bilingual, Properties, Map, $rootScope, Lists, ModalService, toasts, $timeout, oauth, Users, Themes, boardname) {
	
	$('html, body').scrollTop(0);
	var board_name;
	// Themes loader
    console.log($rootScope.user)
    if (typeof $rootScope.user != "undefined") {
      Themes.getUserTheme($rootScope.user.id).then((res) => {
          $rootScope.thisuserid = res.data;
          if ($rootScope.thisuserid.profile.userTheme != null) {
              Themes.getThemeById($rootScope.thisuserid.profile.userTheme).then((res) => {
                  //console.log(res.data);
                  $rootScope.appThemes = res.data;
                  Themes.currentTheme = res.data;
                  // elem.css("background-color", Themes.currentTheme.color_1);
              })
          }
      });
    }

	// ############## OAuth Methods ##############    
	// Get Bilingual system
	$rootScope.storage = $localStorage;
	Bilingual.getLanguage('English');

	



    //END PoLR geocode and isochrone initialization
	// Check if redirected from Oauth, if so, post to API with given token to create user
	function getCodeFromStorage(){
	  let auth = JSON.parse(window.localStorage.getItem('auth'));
	  window.localStorage.removeItem('auth');
	  if(auth){
	    oauth.createUser(auth.code, auth.provider).then(res => {

	      // Check if account with this email already exists
	      if(res.status === 500){
	        $scope.registrationError = {error: ["A user with this email already exists"]};
	        ModalService.showModal({
	          templateUrl: "views/modals/registration-incorrect.html",
	          controller: "LandingCtrl",
	          scope: $scope
	        }).then(function(modal) {
	          modal.element.modal();
	          modal.close.then(function(result) {});
	        });
	      }

	      else {
	        // Set auth token and get user profile
	        Users.setAuthToken(res.data.key);
	        oauth.getUser().then(res => {
	          $rootScope.user = res.data;
	        
	          window.location.href = "/#/allboards"
	        });
	      }
	    })
	  }
	}

	$scope.oauthLogin = function(provider){
	  oauth.authenticate(provider).then(res => {
	    
	  })
	}

	// For Top Nav
	$rootScope.currentPage = "AllBoards";

	// User personalization
	$scope.settings = {
		listView: 'card',
		selectedList: 0,
		properties: [],
        tag: {
            addedTag: false,
            newTag: '',
            editMode: false
        }
	}
	function addCardHoverListener(){
		const cards = Array.from(document.querySelectorAll('.card-wrapper'));
		console.log(cards)
		cards.forEach(card => {
			card.addEventListener('mouseover', e => {
				console.log(e);
				const save = card.getElementsByClassName('card-save')[0];
				save.style.top = '7px';
			})
		})
	}
	
	$scope.onCardsHover = function (property, e) {
		// Map.hightLightPropertyInList(property);
	}

	$scope.onCardsHoverOut = function(e) {
		// Map.removeHighlight();
	}
	
	$scope.closeModal = function(){
		$('.modal-backdrop').hide();
	}
	
	
	
	Properties.getAllFav().then(function(res){
			$scope.properties = res.data;
	})
	
	
	 $scope.selectProperty = function(e,id,property){
		
    	e.preventDefault();
    	
    	if(!property.selected){
			property.selected = true;
			
			if (boardname != null){
				Properties.boardsave(boardname, id).then(function(res){
					
				    
		    	})
			}else{
				Properties.boardsave(board_name, id).then(function(res){
				
				})
			}

		} else {
			property.selected = false;
			toasts.hide();
		}		
    	
		

	}
	
	// ############## Create Board Methods ##############
    $scope.createboardParam = {};
    
    // Open Create Board panel
    $scope.toggleCreateboard = function() {
      $scope.createboardShow = $scope.createboardShow?false:true;
      $scope.createboardArrow = $scope.createboardArrow?false:true;
    }
    
    // Attempt to save board
    $scope.createboard = function(e){

    	e.preventDefault();
    	
    	if (boardname != null){
    		Properties.rename($scope.createboardParam.name,boardname).then(function(res){
     		
    	 	})
    	 	window.location.href = "/#/boards/"+$scope.createboardParam.name;
    		window.location.reload();
    	}else{
    		board_name = $scope.createboardParam.name;	
    		$scope.toggleCreateboard();
    	
    	}
    	
    	
     }
    $scope.done = function(e){
    	e.preventDefault();
    	window.location.reload();
    
    }
	
});
// END #2357 and #2487 Andreina Rojas aroja108@fiu.edu
