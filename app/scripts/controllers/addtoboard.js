// START #2357 and #2487 Andreina Rojas aroja108@fiu.edu 
'use strict';


angular.module('breazehomeDesktop').controller('AddToBoardCtrl', function ($scope, $location, $localStorage, $document, Bilingual, Properties, Map, $rootScope,  Lists, ModalService, toasts, $timeout, oauth, Users, Themes, propertyid) {
	
	$('html, body').scrollTop(0);
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
	
	
	$scope.closeModal = function(){
		$('.modal-backdrop').hide();
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
    	
    	Properties.boardsave($scope.createboardParam.name, propertyid).then(function(res){
        		
    	})
    	
    	
        
    	
    	
    	
     }

 // ############## Edit Board Methods ##############

    
    Properties.getUserBoards().then(function(res){

        $scope.boards = res.data;
    });

    $scope.selectBoard = function(e,name,board){
	
    	e.preventDefault();
    	
    	if(!board.selected){
			board.selected = true;
			
			Properties.boardsave(name, propertyid).then(function(res){
				
			    
	    	})

		} else {
			board.selected = false;
			toasts.hide();
		}		
    	
		

	}
   
});
// END #2357 and #2487 Andreina Rojas aroja108@fiu.edu