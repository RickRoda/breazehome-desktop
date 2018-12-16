'use strict';

//START sortPropertiesbyAttributes:lcaba026@fiu.edu

/*
 * @ngdoc controller
 * @name breazehomeDesktop.controller:SortPropertiesCtrl
 * @description
 * # SortPropertiesCtrl
 * Controller of the breazehomeDesktop
 */

angular.module('breazehomeDesktop').controller('SortPropertiesCtrl', function ($scope, $filter, $rootScope, Properties, close, ModalService) {


  $scope.close = close;

//---------------------------------------------------------------------------------------------
//function that when click reverses the priority from ascending to descending in the attributes

  $scope.reversePriority = function (index) {

    $rootScope.sortItems[index].asc = !$rootScope.sortItems[index].asc
  }

//---------------------------------------------------------------------------------------------
//function that when an element is click, it's selected or deselected and moved programatically

  $scope.clickAttribute = function(index) {


    //when element is not selected
    var matchGroup = $('ul').find('.test-seleted[data-group= "li-1"]');
    if ($rootScope.sortItems[index].selected == false) {

      var destIndex = matchGroup.length;
      //check for selected elements in the array
      if (matchGroup.length > 0) {
        $rootScope.sortItems[index].selected = !$rootScope.sortItems[index].selected;
        var removed_item = $rootScope.sortItems[index]
        $rootScope.sortItems.splice(index, 1)   //remove an element
        $rootScope.sortItems.splice(destIndex, 0,removed_item) //replace an element from one place to another
        destIndex++;
      }
      else{
        $rootScope.sortItems[index].selected = !$rootScope.sortItems[index].selected;
        var removed_item = $rootScope.sortItems[index]
        $rootScope.sortItems.splice(index, 1)      //remove an element
        $rootScope.sortItems.unshift(removed_item) //place element to the top

      }
    }
    //whe element is selected
    else {

      var matchSel = $('ul').find('.test-unseleted[data-group= "li-1"]');
      var desttIndex = matchGroup.length -1;

      if (matchSel.length > 0){
        $rootScope.sortItems[index].selected = !$rootScope.sortItems[index].selected;
        var removed_item = $rootScope.sortItems[index]
        $rootScope.sortItems.splice(index, 1)
        $rootScope.sortItems.splice(desttIndex, 0,removed_item)
      }
      else {
        $rootScope.sortItems[index].selected = !$rootScope.sortItems[index].selected;
        var removed_item = $rootScope.sortItems[index]
        $rootScope.sortItems.splice(index, 1)
        $rootScope.sortItems.push(removed_item)
      }
      desttIndex--;
    }
  }

//----------------------------------------------------------------------------------
//function that when icon arrow up is click moved element to top of array

  $scope.clickArrow = function(index) {

   // $scope.selecItem = $rootScope.sortItems[index];
    if($rootScope.sortItems[index].selected == false){ //element not selected
      $rootScope.sortItems[index].selected = true;
      var removed_item = $rootScope.sortItems[index]
      $rootScope.sortItems.splice(index, 1)
      $rootScope.sortItems.unshift(removed_item)
    }
    else {
      $rootScope.sortItems[index].selected = true;
      var removed_item = $rootScope.sortItems[index]
      $rootScope.sortItems.splice(index, 1)
      $rootScope.sortItems.unshift(removed_item)
    }
  }

//------------------------------------------------------------------------------------------------
//function place selected attributes in an array and is passed to result.js as rootScope variable

  $scope.applySort = function() {

    angular.forEach($scope.properties, function (property) {
      property.currentPrice = parseFloat(property.currentPrice);
    })

    //Hash map with the list of attributes from backend
    var map = {
      Price: 'currentPrice',
      Beds:"bedsTotal",
      Baths:"bathsFull",
      Size:"sqFtTotal",
      Year:"yearBuilt"
    };

    var result = [];

    for (var index= 0; index < $rootScope.sortItems.length ; index++) {
      if ($rootScope.sortItems[index].selected == true && $rootScope.sortItems[index].active == true){

        result.push(($rootScope.sortItems[index].asc == true? map[$rootScope.sortItems[index].name] : "-" + map[$rootScope.sortItems[index].name]));

      }
    }
    $rootScope.sortRule = result;
    $rootScope.isSorted = true;


    close();

  }
//------------------------------------------------------------------------------------------------
//function that allow to dragg elements to different location, and reposition them if elements are
//selected or unselected, so hirearchy will change accordingly.

  $scope.sortableOptions = {
    stop: function (e, ui) {
      groupItems()
    }
  }

  var groupItems = function () {
    for(var i = 0; i < $rootScope.sortItems.length; i++){
      if($rootScope.sortItems[i].selected){
        var removed_item = $rootScope.sortItems[i]
        $rootScope.sortItems.splice(i, 1)
        $rootScope.sortItems.unshift(removed_item)
      }
    }
    for(var i = 0; i < $rootScope.sortItems.length; i++){
      if($rootScope.sortItems[i].selected){
        var removed_item = $rootScope.sortItems[i]
        $rootScope.sortItems.splice(i, 1)
        $rootScope.sortItems.unshift(removed_item)
      }
    }
  }

//------------------------------------------------------------------------------------------------
//  Open custom modal for customize sort panel

  $scope.showCustomizeSort = function() {

    $scope.counter =  cop;

      ModalService.showModal({
      templateUrl: "views/modals/customizeSort.html",
      controller:"SortPropertiesCtrl",
      bodyClass: "custom-modal-open",
      scope : $scope
    }).then(function(modal) {
      modal.close.then(function(result) {

      });

    })

    $("#sort-custom-modal").hide();
  };

  //-----------------------------------------------------------------------------------------------

  $scope.min = 1;
  //s$scope.max = 4;
  $scope.counter = 4;

//-----------------------------------------------------------------------------------------------


  $scope.updateCounter = function() {
    $scope.counter = 0;
    for(var i = 0; i < $rootScope.sortItems.length; i++){
      $scope.counter+= $rootScope.sortItems[i].checkbox_checked ? 1 : 0;
    }
    $scope.upco = $scope.counter;

    return $scope.upco;
  }

  var cop  = $scope.updateCounter();


//-----------------------------------------------------------------------------------------------
  $scope.applyCustomSort = function() {

    for(var i = 0; i < $rootScope.sortItems.length; i++){

      $rootScope.sortItems[i].active = $rootScope.sortItems[i].checkbox_checked;

      if (!$rootScope.sortItems[i].active && $rootScope.sortItems[i].selected){
        $scope.clickAttribute(i);
        $rootScope.sortItems[i].active = $rootScope.sortItems[i].checkbox_checked;
      }
    }
    close();
    $("#sort-custom-modal").show();
  }

//-----------------------------------------------------------------------------------------------
  $scope.closeCustomSort = function() {

    for(var i = 0; i < $rootScope.sortItems.length; i++){
     $rootScope.sortItems[i].checkbox_checked = $rootScope.sortItems[i].active;
    }
    close();
    $("#sort-custom-modal").show();
  }


});


//END sortPropertiesbyAttributes
