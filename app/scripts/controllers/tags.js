'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop').controller('TagsCtrl', function ($scope, Tags, Map) {
	
	// User personalization
	$scope.settings = {
		listView: 'card',
		selectedList: 0,
		properties: []
	}

	// Get all user's lists
	function getAllLists(){
		Tags.getAll().then(res => {
			$scope.lists = res.data.results;
			getPropertiesFromList($scope.settings.selectedList);
		})
	}

    // User selected list to view
    $scope.selectList = function(index){
    	$scope.settings.selectedList = index;
    	getPropertiesFromList($scope.lists[index]);
    }

    // Get all properties from a given list
    function getPropertiesFromList(listId){
    	$scope.settings.properties = [1,2,3,4,5,6,7];
    }

    // User has begun dragging property
    $scope.propertyMouseDown = function(e){
    	const selectedCard = $(e.currentTarget);
    	// console.log(selectedCard)
    	// selectedCard.addClass('card-dragging');
    	// selectedCard.append('<i class="glyphicon glyphicon-home test"></i>');
    	selectedCard.draggable();
    }

    getAllLists();
    $('body').css('overflow', 'hidden');
    Map.initMap('map-list');
   
});
