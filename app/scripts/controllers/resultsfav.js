// START #2357 and #2487 Andreina Rojas aroja108@fiu.edu
'use strict';

/*
 * @ngdoc controller
 * @name breazehomeDesktop.controller:ResultsCtrl
 * @description
 * # ResultsFavCtrl
 * Controller of the breazehomeDesktop
 */

angular.module('breazehomeDesktop').controller('ResultsFavCtrl', function ($scope, $location, $localStorage, $document, Bilingual, Properties, Map, $rootScope, Lists, ModalService, toasts, $timeout, oauth, Users, Themes) {
	
	$('html, body').scrollTop(0);

	// Get Bilingual system
	$rootScope.storage = $localStorage;
	Bilingual.getLanguage('English');

	// For Top Nav
	$rootScope.currentPage = "ResultsFav";
 	
 	var getPropertiesByFilter = function() {

 			Properties.getAllFav().then(function(res){
 				$scope.properties = res.data;

            if($rootScope.addrSearchFlag !== undefined) {
        		$scope.properties = $rootScope.properties;
        		console.log($scope.properties);
        	}

		})
 	}

 	getPropertiesByFilter();

	// Save user's search
	$scope.saveCurrentSearch = function() {
		Properties.saveSearch("Saved search", filter);
		Users.getSavedSearches().then(function(res){
	      toasts.show("Search filters saved");
	      console.log($rootScope.savedSearches);
	    });
	}

	$scope.selectPropertyToBoard = function(e,prop,id){
		e.preventDefault();
		$scope.propertyToAdd = id;

		
		ModalService.showModal({
			   templateUrl: "views/modals/addtoboard.html",
			   controller: "AddToBoardCtrl",
			   inputs: {
				   propertyid: id,
			   }
			}).then(function(modal) {
			   modal.element.modal();
			   modal.close.then(function(result) {});
			});

	}
	

	// Add property to user list
	$scope.addPropertyToList = function(e, prop, id){
		e.preventDefault();
		$scope.propertyToAdd = id;

			if(!prop.saved){
				prop.saved = true;
				
				
				Properties.unfavorite(id).then(res => {
					//console.log(res);
					toasts.show("Removed property from favorites");
				})	                  		
				
				toasts.show("Removed property from favorites");
			} else {
				toasts.show("Removed property from favorites");
				prop.saved = false;
				toasts.hide();
			}		
	}

	$scope.closeModal = function(){
		$('.modal-backdrop').hide();
	}

	// Choose which list to add property to, then add it
	$scope.chooseList = function(list){
		Lists.addPropertyToList($scope.propertyToAdd, list).then(res => {
			$scope.closeModal();
		})
	}

	$('body').css('overflow', 'hidden');
	
	// Add commas to price numbers
	$scope.formatPrice = function(x){
		if(x !== null){
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}		
	}
		
	// Format city to proper Title Case
	$scope.formatCity = function(x){
		
		if(x !== null){
		
			return x.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		
		}	
		
	}
		
	// Open input field to add new property tag
		
	$scope.openTagModal = function(e){
		
		e.preventDefault();
		
		const form = $(e.target.nextElementSibling)[0];
		
		$(form).addClass('fadeInDown');
		
	}
		
	
		
	// Close input field to add a new property tag
		
	$scope.closeTagModal = function(e){
		
		e.preventDefault();
		
		const form = $(e.target.offsetParent)[0];
		
		$(form).removeClass('fadeInDown');
		
	}
		
	
		
	// Add new tag to property
		
	$scope.addNewTag = function(e, prop){
		
		if($scope.settings.tag.newTag){
		
			$scope.tags.push($scope.settings.tag.newTag);
		
			$scope.settings.tag.newTag = '';
		
			const form = $(e.target);
		
			$(form).removeClass('fadeInDown');
		
		}
		
	}	
	
		
	$scope.tags = ['luxury', 'beautiful', 'modern'];

	$scope.names = ["1+", "2+", "3+", "4+", "5+", "6+"];

	$scope.things = [
        {text:'1+'},
        {text:'2+'},
        {text:'3+'},
        {text:'4+'},
        {text:'5+'}
        ];
    $scope.thing = 'Home';

    // redirect to property detail
    $scope.clickCard = function(property) {
 
    	window.location.href = "/#/results/"+property.id;

    }
    
    
});

// END #2357 and #2487 Andreina Rojas aroja108@fiu.edu
