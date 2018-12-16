'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:ListsCtrl
 * @description
 * # ListsCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop').controller('ListsCtrl', function ($scope, Lists, Map, $timeout, $rootScope, Tags, ModalService, toasts, $document, Properties) {

  // Map and page overflow	
  $rootScope.currentPage = "Saved Properties";
  $('body').css('overflow', 'hidden');
  Map.initMap('map-list');

	// User personalization
	$scope.settings = {
		listView: 'card',
		selectedTags: [],
		properties: [],
    tag: {
        addedTag: false,
        newTag: '',
        editMode: false
    },
    clear: true
	}

  // Get all user's saves homes
  Properties.getSaved().then(res => {
    $scope.properties = res.data.results[0].propertyObjects;
    $scope.randomTags();
  });

  // Get all user's tags
  function getTags(){
      Tags.getAll().then(res => {
          $scope.tags = res.data.results;
      })
  }

  $scope.randomTags = function(){
    $scope.properties.map(prop => {
      const tags = ['luxury', 'beautiful', 'modern', 'twoStories', 'niceNeighbors', 'oceanView', 'incredible', 'fence', 'community', 'security', 'cameras', 'petFriendly', 'publix', 'comcast', 'goodCoverage', 'budget']
      const randNum = (Math.floor(Math.random()*tags.length) % tags.length) +1;
      const prop_tags = [];
      for(let i = 0; i < randNum; i++){
        const randNum2 = (Math.floor(Math.random()*tags.length) % tags.length) +1;
        prop_tags.push(tags[randNum2]);
      }   
      prop.tags = prop_tags;
    })
  }

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

  // Unsave property from user's list
  $scope.unsaveProperty = function(index){
    $scope.properties.splice(index, 1);
    $timeout(() =>{
      toasts.show("Unsaved property");
    }, 1000)
  }

  // User selected tag
  $scope.selectTag = function(index, tag){
      $scope.settings.clear = false;
      const indexToDelete = $scope.settings.selectedTags.indexOf(index);
      if(indexToDelete == -1){
        tag.selected = true;
        $scope.settings.selectedTags.push(index);
        console.log($scope.settings.selectedTags)
      }
      else {
        $scope.settings.selectedTags.splice(indexToDelete, 1);
        tag.selected = false;
      }
  }

  //User clears all tag filters
  $scope.clearTagFilters = function(){
    $scope.settings.clear = !$scope.settings.clear;
    $scope.tags.map(tag => {
      tag.selected = false;
    })
    $scope.settings.selectedTags = [];
  }

  // User deletes tag
  $scope.deleteTagAttempt = function(index){
      $scope.tagToDelete = $scope.tags[index];
      ModalService.showModal({
        templateUrl: "views/modals/deleteTag.html",
        controller: "ListsCtrl",
        scope: $scope
      }).then(function(modal) {            
        modal.element.modal();
        modal.close.then(function(result) {});

        $scope.deleteTag = function(){
          Tags.delete($scope.tagToDelete.id).then(res => {
              const x = $scope.tags.indexOf($scope.tagToDelete);

              // Remove tag from list
              $scope.tags.splice(x, 1);
              toasts.show("Successfully removed #" + $scope.tagToDelete.tag);
          })
        }

      });
  }

  getTags();

  // Open input field to add new property tag
  $scope.openTagModal = function(e){
    e.preventDefault();
    const form = $(e.target.nextElementSibling)[0];
    $(form).addClass('fadeInDown');
  }

  // Add new tag to property
  $scope.addNewTag = function(e, prop){
    if($scope.settings.tag.newTag){
      $scope.tags.push({'tag': $scope.settings.tag.newTag});
      prop.tags.unshift($scope.settings.tag.newTag)
      $scope.settings.tag.newTag = '';
      const form = $(e.target);
      $(form).removeClass('fadeInDown');
    }
  }








  // Filter methods
  $scope.priceMin = 0;
  $scope.priceMax = 100000000;

  let propertiesBusy = true;
  let propertiesOffset = 0;

  // Get all properties from API 
  Properties.getAll().then(function(res){
   $scope.settings.properties = res.data;
   propertiesBusy = false;
   // Map.setProperties($scope.properties.results)
  })

  $scope.filterHide = true;
  $scope.hideMore = true;
  $scope.moreFilterText = "More filters";

  $document.bind('click', function(e){
      // console.log($(e.target));
      if (!$(e.target).is(".results-filter-button") && !$(e.target).parents('.results-filter-dropdown').length || $(e.target).is("#apply.results-filter-header-button.col-md-3")) {
          $scope.$apply(function() {
              $scope.filterHide = true;
          });
      } 
      else {
          $scope.$apply(function() {
              $scope.filterHide = false;
          });
      }
  });

  $scope.applyFilter = function() {
      console.log("Apply filter");
  }

  $scope.closeFilter = function(){
      
  }

  $scope.expandMore = function() {
      $scope.hideMore = $scope.hideMore?false:true;
      $scope.moreFilterText = $scope.hideMore?"More filters":"Less filters";
  }

  $scope.filterTypes = [
      { name: 'Apartment',    checked: true },
      { name: 'Conda',        checked: true },
      { name: 'House',        checked: true },
      { name: 'Trailer',      checked: false },
      { name: 'Land',         checked: false },
      { name: 'Towndhouse',   checked: false },
      { name: 'Other',        checked: false }
  ];
  $scope.filterTransType = [
      { name: 'Sale',         checked: true },
      { name: 'Rent',         checked: true },
      { name: 'Shared',       checked: false },
      { name: 'Foreclosure',  checked: false },
      { name: 'Sublet',       checked: false },
      { name: 'Other',        checked: false }
  ];
  $scope.filterFeatures = [
      { name: 'Gym',          checked: false },
      { name: 'Pool',         checked: false },
      { name: 'Laundry',      checked: false },
      { name: 'Parking Garage',   checked: false },
      { name: 'Street Parking',       checked: false },
      { name: 'Concierge',        checked: false },
      { name: 'Yard',     checked: false },
      { name: 'Patio',        checked: false },
      { name: 'Balcony',      checked: false },
      { name: 'Waterfront',       checked: false },
      { name: 'Porch',        checked: false },
      { name: 'Wheelchair accessible',        checked: false }
  ];

  //Options used by search filter
  $scope.options = {
      squareMeters: {
        min: 0,
        max: 500,
        options: {
          floor: 0, 
          ceil: 500,
          rightToLeft: ($rootScope.isFarsi === true),
          step: 10
        }
      },
      livingArea: {
        min: 0,
        max: 500,
        options: {
          floor: 0, 
          ceil: 500,
          rightToLeft: ($rootScope.isFarsi === true),
          step: 10
        }
      },
      totalPrice: {
        min:  0,
        max:  1000,
        options: {
          floor: 0,
          ceil: 1000,
          step: 10,
          hidePointerLabels: true,
          hideLimitLabels: true,
          translate: function(value) {
            if(value < 1000) {
              return value;
            }
            else if(value >= 1000 && value < 1000000) {
              return value / 1000 + 'K';
            }
            else if (value >= 1000000){
              return value / 1000000 + 'M';
            }
          }
        }
      },
      parking: {
        enabled: false
      },
      storage: {
        enabled: false
      },
      elevator: {
        enabled: false
      },
      pool: {
        enabled: false
      },
      bedrooms: {
        value: 1
      },
      floorNum: {
        min: 0,
        max: 20,
        options: {
          floor: 0,
          ceil: 20,
          rightToLeft: ($rootScope.isFarsi === true)

        }
      },
      buildingAge: {
        min: 0,
        max: 20,
        options: {
          floor: 0,
          ceil: 20,
          rightToLeft: ($rootScope.isFarsi === true)

        }
      },
      requestType: {
        rent: {
          value: true, 
          id: 2
        },
        deposit: {
          value: true, 
          id: 3
        },
        sale: {
          value: true, 
          id: 1
        },
        exchange: {
          value: true, 
          id: 5
        },
        collaborative: {
          value: true, 
          id: 4
        },
        unknown: {
          value: true, 
          id: 6
        },
      },
      requestData: ''
  };

});
