'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:ResultDetailCtrl
 * @description
 * # ResultDetailCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop').controller('ResultDetailCtrl', function ($scope, $rootScope, $location, $localStorage, $routeParams, $anchorScroll, $http, Properties, Amenities, Bilingual, Map, BASE_URL, IMAGE_URL, ModalService, History) {

    $('body').css('overflow', 'auto');
    $('html, body').scrollTop(0);
    $scope.storage = $localStorage;
    Bilingual.getLanguage('English');

    Properties.getById($routeParams).then(function(res){
  	  $scope.property = res;
      // Niuriset: changing page title and meta tags for Facebook Crawler
      addMetaData($scope.property);
  	})

/* START View Competition for Properties : adubu002@fiu.edu */
    Properties.updatePropertyViews($routeParams).then(function(res){
  	  $scope.viewCount = res;
  	})
/* END View Competition for Properties */

    //Richard Roda
    // Email: rroda001@fiu.edu
    // Perform lien search on current property and return results to the $scope.lienList variable
    Properties.getLiens($routeParams).then(function(res){
      $scope.lienList = res;
  	})
    // BENGIN changing page title and meta tags for Facebook Crawler. Niuriset
    var addMetaData = function(property) {
      //Adding regular html title to page
      document.title = property.addressInternetDisplay + ' | MLS #'+ property.dXorigmlno +' | BreazeHome';

      $('meta[name=description]').remove();
      $('head').append('<meta name="description" content="' + property.remarks + '"/>');

      $('head').append('<meta property="og:title" content="' + property.addressInternetDisplay + ' | MLS #' + property.dXorigmlno +' | BreazeHome' + '"/>');
      $('head').append('<meta property="og:description" content="'+ property.remarks + '"/>');
      $('head').append('<meta property="og:url" content="' + 'http://www.breazehome.com/#/results/' + property.id+ '"/>'); // would be fine to use BASE_URL?
      $('head').append('<meta property="og:image" content="' + "https://breazehome.com/images/logo.png" + '"/>'); // need to add Main Image to display
    }
    // END hanging page title and meta tags for Facebook Crawler

    History.pushPropertiesHistroy($routeParams.id);
    $rootScope.history = History.getHistory();
    // $rootScope.history.searchesHistroy.slice(0,2);
    // $rootScope.history.propertiesHistroy.slice(0,2);

    // Format city to proper Title Case
    $scope.formatCity = function(x){
      if(x !== null){
        return x.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    }

    var neighborType = "restaurant"

    $scope.neighborClick = function(neighborType) {
      //console.log("neighborClick", neighborType)
      $scope.neighborhoods = []
      Properties.getNeighborhoods($scope.propertyLocation, neighborType).then(function(res){
        $scope.neighborhoods = res.data;
        //console.log("neighborhoods",$scope.propertyLocation, $scope.neighborhoods)
        for(var i = 0; i < $scope.neighborhoods.length; i++) {
          $scope.neighborhoods[i].index = (i+1).toString();
          //console.log($scope.propertyLocation, $scope.neighborhoods[i])
          var dis = Map.distance($scope.propertyLocation, new L.LatLng($scope.neighborhoods[i].lat, $scope.neighborhoods[i].lon));
          $scope.neighborhoods[i].distance = dis.toFixed(2) + "mi" //"0.22 mi"
        }

        if($scope.neighborMarkers != null && $scope.neighborMarkers.length != 0) {
          Map.removeMarkers($scope.mapNeighbor, $scope.neighborMarkers);
        }
        $scope.neighborMarkers = []
        var neighCoords = []
        var neighPopup = []
        for(var i = 0; i < $scope.neighborhoods.length; i++) {
          neighCoords.push([parseFloat($scope.neighborhoods[i].lat) , parseFloat($scope.neighborhoods[i].lon)] )
          neighPopup.push($scope.neighborhoods[i].institutionName);
        }
        $scope.neighborMarkers = Map.showMarkersWithNumber($scope.mapNeighbor, neighCoords, neighPopup);
      })
    }
/*START Neighborhood Amenities : adubu002@fiu.edu*/
    $scope.amenityCat = null;
    $scope.amenityMarkers = [];
    $scope.amenityTypes = [];

    //loads yelp categories from a local json file
    $http.get('../scripts/dictionaries/yelpCategories.json').then(function(res) {
      $scope.amenityTypes = res.data;
    });

    //when an amenityType is clicked a list of corresponding amenities is returned
     $scope.amenityClick = function(amenityType) {
       $scope.amenityList = [];
       $scope.amenities = []
       $scope.amenityListCheck();

       //API call that gets the amenities based on category and stores them in the variable amenitites
       Amenities.getAmenitiesByCategory($scope.propertyLocation, amenityType).then(function(res){
         $scope.mapAmenity.setView($scope.propertyLocation, 14);
         $scope.amenities = res.data.businesses;
         for(var i = 0; i < $scope.amenities.length; i++) {
           var check = false;
           $scope.amenities[i].check = check;
           $scope.amenities[i].imageUrl = $scope.amenities[i].imageUrl === '' ? '../images/detail/no-image-available.jpg' : $scope.amenities[i].imageUrl = $scope.amenities[i].imageUrl;
           $scope.amenities[i].index = (i+1).toString();
           var dis = $scope.amenities[i].distance * 0.000621371;
           $scope.amenities[i].distanceTo = dis.toFixed(2);
           var percent = Math.round(($scope.amenities[i].rating / 5) * 100);
           $scope.amenities[i].starPercent = percent + '%';
         }

         //remove old amenity markers from map
         if($scope.amenityMarkers != null && $scope.amenityMarkers.length != 0) {
           Map.removeMarkers($scope.mapAmenity, $scope.amenityMarkers);
         }
         $scope.amenityMarkers = []
         var neighCoords = []
         var neighPopup = []
         if($scope.amenityCat != amenityType){
           for(var i = 0; i < $scope.amenities.length; i++) {
             neighCoords.push([parseFloat($scope.amenities[i].coordinates.latitude) , parseFloat($scope.amenities[i].coordinates.longitude)] )
             neighPopup.push($scope.amenities[i].name);
           }

           //show amenity markers on map
           $scope.amenityMarkers = Map.showMarkersWithNumber($scope.mapAmenity, neighCoords, neighPopup);
           $scope.amenityCat = amenityType;
         }
         else{
           $scope.amenityCat = null;
         }
       })
     }

     //when an amenity is selected the map is updated as well as the webpage css
     $scope.amenitySelect = function(){
       if($scope.amenityMarkers != null && $scope.amenityMarkers.length != 0) {
         //removes old amenity markers
         Map.removeMarkers($scope.mapAmenity, $scope.amenityMarkers);
       }
       var neighCoords = []
       var neighPopup = []
       for(var i = 0; i < $scope.amenities.length; i++) {
         neighCoords.push([parseFloat($scope.amenities[i].coordinates.latitude) , parseFloat($scope.amenities[i].coordinates.longitude)] )
         neighPopup.push($scope.amenities[i].name);
       }
       //shows new amenity markers on map with altered css for selected amenities
       $scope.amenityMarkers = Map.selectMarkerWithNumber($scope.mapAmenity, neighCoords, neighPopup, $scope.amenities);
     }

     //whenever an amenity is selected its variable check is set to true and vice-versa
     //the all amenities are then checked for their check status and added to a variable amenityList
     //if check == true
     $scope.toggleAmenity = function(amenity){
       amenity.check = amenity.check === false ? true : false;
       $scope.amenityList = [];
       for(var i = 0; i < $scope.amenities.length; i++) {
         if($scope.amenities[i].check != false){
           $scope.amenityList.push($scope.amenities[i])
         }
       }
       $scope.amenityListCheck();

       var neighCoords = [];
       for(var i = 0; i < $scope.amenities.length; i++){
         if($scope.amenities[i].check){
           neighCoords.push([parseFloat($scope.amenities[i].coordinates.latitude) , parseFloat($scope.amenities[i].coordinates.longitude)] );
         }
       }
       neighCoords.push($scope.propertyLocation);

       //shifts and zooms map to encompass selected amenities i.e amenities in the amenityList
       Map.encompassPoints($scope.mapAmenity, neighCoords);
       if($scope.amenityList == 0){
          $scope.mapAmenity.setView($scope.propertyLocation, 14);
       }

     }

     //checks whether amenityList is empty
     $scope.amenityListCheck = function(){
       $scope.listEmpty = false;
       if($scope.amenityList.length > 0){
         $scope.listEmpty = true;
       }
     }

     $scope.listEmpty = false;
     $scope.mapFocus = true;
     $scope.listFocus = false;

     //function that controls variable to toggle map view of amenities
     $scope.toggleMapFocus = function(){
       $scope.listFocus = false;
       $scope.mapFocus = $scope.mapFocus === false ? true : true;
     }

     //function that controls variable to toggle list view of amenities
     $scope.toggleListFocus = function(){
       $scope.mapFocus = false;
       $scope.listFocus = $scope.listFocus === false ? true : true;
     }

     //function that selects amenity and alters change css to show it has been selectedMarker
     //it also redraws map with new map amrkers to indicate selection
     $scope.amenityHighlight = function(amenity){
       $scope.toggleAmenity(amenity);
       $scope.amenitySelect();
     }

  /* END Neighborhood Amenity */


    $scope.imageURL = IMAGE_URL;
    $scope.nullImage = false;
    $scope.currentImage = 0;
    Properties.getMediaById($routeParams).then(function(res){
      $scope.imagesNum = (res.data.count-1)<0?0:(res.data.count-1);
      $scope.images = res.data.results.slice(0, $scope.imagesNum);
      $scope.leftImages = $scope.images.slice(0, $scope.imagesNum/2);
      $scope.rightImages = $scope.images.slice($scope.imagesNum/2, $scope.imagesNum);
      $scope.currentImage = $scope.images.length - 1;
      // console.log($scope.images);
      // console.log($scope.imagesNum);
      if($scope.imagesNum < 1) {
        $scope.nullImage = true;
      }
      else {
        $("#mainImage").css("background-image", "url(" + IMAGE_URL+$scope.images[$scope.currentImage].path+")");
        $scope.currentImageURL = IMAGE_URL+$scope.images[$scope.currentImage].path;
        // $("#popup-mainImage").imageViewer(IMAGE_URL+$scope.images[$scope.currentImage].path);
        // console.log($scope.currentImage+":"+$scope.images[$scope.images.length - $scope.currentImage - 1].path);
        for(var i=0; i<$scope.images.length; i++) {
          if(i == $scope.currentImage) continue;
          // console.log($("#pic"+i).position());
          // $("#pic"+i).css({
          //   'left': '10px',
          //   'top': '10px'
          // })
          // console.log(i+":"+$scope.images[$scope.images.length-i-1].path);
          // $("#photos").append("<div class='detail-image-unselected' style='background-image:'"+BASE_URL+$scope.images[i].path+"'></div>");
        }
      }
    })



    $scope.changeImage = function(image) {
      $scope.currentImage = image.path.match('/([0-9]+)-')[1];
      $scope.currentImageURL = IMAGE_URL+image.path;
      // console.log($scope.currentImage);
      $("#mainImage").css("background-image", "url(" + IMAGE_URL+image.path+")");
    }
    $scope.changeGalleryImage = function(image) {
      $scope.currentImage = image.path.match('/([0-9]+)-')[1];
      $scope.currentImageURL = IMAGE_URL+image.path;
      // console.log($scope.currentImage);
      $("#mainImage").css("background-image", "url(" + IMAGE_URL+image.path+")");
      // $("#popup-mainImage").css("background-image", "url(" + BASE_URL+image.path+")");
      $("#popup-mainImage").imageViewer(IMAGE_URL+image.path);
    }

    $scope.expandGallery = function(currentImageURL) {
      // e.preventDefault()
      ModalService.showModal({
        templateUrl: "views/modals/gallery.html",
        controller: "ResultDetailCtrl",
        scope: $scope
      }).then(function(modal) {
        // console.log(currentImageURL);
        $("#popup-mainImage").imageViewer(currentImageURL);
        if ($scope.mapPopup === undefined)
        {
          $scope.mapPopup = Map.loadMap("map-popup", false);
          Map.showMarkersWithImage($scope.mapPopup, $scope.popupCoord);
          Map.MoveMapTo($scope.mapPopup, $scope.propertyLocation)
        }
        modal.element.modal();
        modal.close.then(function(result) {
          $("#popup-mainImage").removeAttr('id');
        });
      });
    }

    $scope.showSharingDialog = function() {
      ModalService.showModal({
        templateUrl: "views/modals/sharePropertyDialog.html",
        controller: "shareDialogCtrl",
        scope: $scope
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {});
      });
    }

    $scope.showMap = $scope.nullImage?true:false;
    $scope.switchMap = function() {
      $scope.showMap = $scope.nullImage?false:true;
    }

  $scope.imageURL = IMAGE_URL;
  $scope.nullImage = false;
  $scope.currentImage = 0;
  Properties.getMediaById($routeParams).then(function(res) {
    $scope.imagesNum = (res.data.count - 1) < 0 ? 0 : (res.data.count - 1);
    $scope.images = res.data.results.slice(0, $scope.imagesNum);
    $scope.leftImages = $scope.images.slice(0, $scope.imagesNum / 2);
    $scope.rightImages = $scope.images.slice($scope.imagesNum / 2, $scope.imagesNum);
    $scope.currentImage = $scope.images.length - 1;
    // console.log($scope.images);
    // console.log($scope.imagesNum);
    if ($scope.imagesNum < 1) {
      $scope.nullImage = true;
    } else {
      $("#mainImage").css("background-image", "url(" + IMAGE_URL + $scope.images[$scope.currentImage].path + ")");
      $scope.currentImageURL = IMAGE_URL + $scope.images[$scope.currentImage].path;
      // $("#popup-mainImage").imageViewer(IMAGE_URL+$scope.images[$scope.currentImage].path);
      // console.log($scope.currentImage+":"+$scope.images[$scope.images.length - $scope.currentImage - 1].path);
      for (var i = 0; i < $scope.images.length; i++) {
        if (i == $scope.currentImage) continue;
        // console.log($("#pic"+i).position());
        // $("#pic"+i).css({
        //   'left': '10px',
        //   'top': '10px'
        // })
        // console.log(i+":"+$scope.images[$scope.images.length-i-1].path);
        // $("#photos").append("<div class='detail-image-unselected' style='background-image:'"+BASE_URL+$scope.images[i].path+"'></div>");
      }
    }
  })

  $scope.changeImage = function(image) {
    $scope.currentImage = image.path.match('/([0-9]+)-')[1];
    $scope.currentImageURL = IMAGE_URL + image.path;
    // console.log($scope.currentImage);
    $("#mainImage").css("background-image", "url(" + IMAGE_URL + image.path + ")");
  }
  $scope.changeGalleryImage = function(image) {
    $scope.currentImage = image.path.match('/([0-9]+)-')[1];
    $scope.currentImageURL = IMAGE_URL + image.path;
    // console.log($scope.currentImage);
    $("#mainImage").css("background-image", "url(" + IMAGE_URL + image.path + ")");
    // $("#popup-mainImage").css("background-image", "url(" + BASE_URL+image.path+")");
    $("#popup-mainImage").imageViewer(IMAGE_URL + image.path);
  }

  $scope.showMap = $scope.nullImage ? true : false;

  $scope.switchMap = function() {
    $scope.showMap = $scope.showMap ? false : true;
  }

  $scope.exitDetail = function() {
    $scope.miniMap = null;
    $location.path('/results');
  }

  Properties.getAll().then(function(res) {
    $scope.properties = res.data.results.slice(0, 50);
  });

  // ############## Mini map init ##############
  if (!$scope.miniMap)
  {
    $scope.miniMap = Map.loadMap("mini-map", false);
  }
  if (!$scope.mapHolder)
  {
    $scope.mapHolder = Map.loadMap("map-holder", false);
  }
  if (!$scope.mapNeighbor)
  {
    $scope.mapNeighbor = Map.loadMap("map-neighbor", false);
    Map.zoomMap($scope.mapNeighbor, 14)
  }
  if (!$scope.mapAmenity)
  {
    $scope.mapAmenity = Map.loadMap("map-amenity", false);
    Map.zoomMap($scope.mapAmenity, 14)
  }

    // $scope.map.showMarkersWithImage($scope.map, $scope.properties.coords)
  Properties.getLocationById($routeParams).then(function(res){
    //test data
    // if(res.data == null || res.data.length == 0) {
    //   var prop = {};

    //   var lat = (Math.random() * (25.59 - 25.89) + 25.89).toFixed(4);
    //   var lon = (Math.random() * (-80.47 + 80.12) -80.12).toFixed(4);
    //   prop.point = {};
    //   prop.point.latitude = lat;
    //   prop.point.longitude = lon;
    //   res.data.push(prop);
    //   console.log(res)
    // }

    if(res.data != null && res.data.length > 0 && res.data[0].point != null && res.data[0].point.latitude != null && res.data[0].point.longitude != null) {

      var coord = [res.data[0].point.latitude, res.data[0].point.longitude];
      $scope.long = res.data[0].point.longitude;
      $scope.lat = res.data[0].point.latitude;
      $scope.propertyLocation = new L.LatLng(coord[0], coord[1]);
      $scope.popupCoord = [coord]
      var coords = [coord];
      if (!$scope.nullImage)
      {
        Map.showMarkersWithImage($scope.miniMap, coords);
        Map.MoveMapTo($scope.miniMap, $scope.propertyLocation)
      }
      if ($scope.nullImage)
      {
        Map.showMarkersWithImage($scope.mapHolder, coords);
        Map.MoveMapTo($scope.mapHolder, $scope.propertyLocation)
      }
      if ($scope.mapNeighbor)
      {
      //console.log("!!!", $scope.mapNeighbor, $scope.propertyLocation)
        Map.MoveMapTo($scope.mapNeighbor, $scope.propertyLocation)
      }

/* START Neighborhood Amenities : adubu002@fiu.edu */
      if ($scope.mapAmenity)
      {
        Map.showMarkersWithImage($scope.mapAmenity, coords);
        Map.MoveMapTo($scope.mapAmenity, $scope.propertyLocation)
        Map.zoomMap($scope.mapAmenity, 14)
      }
/* END Neighborhood Amenities */
      // $scope.neighborClick("school");

    }
  })



  $scope.fileDetailAccordionSections = [
    {
      name: 'Facts',
      shown: true
    },
    {
      name: 'Features',
      shown: false
    },
    {
      name: 'Map',
      shown: false
    },
    {
      name: 'Contacts',
      shown: false
    },
    {
      name: 'Notes',
      shown: false
    }
  ]

  // START Add Schools to Details Page Map:amoha083@fiu.edu
  Properties.getSchools().then(function(res){
          $scope.allSchools = res.data.results;          
        });
  $scope.schoolMarkers = [];

  $scope.showSchoolOnMap = function(){
      for(var i in $scope.allSchools) {
            $scope.schoolMarkers.push(Map.addSchools([$scope.allSchools[i].latitude, $scope.allSchools[i].longitude], $scope.allSchools[i], $scope.mapNeighbor))
          }
  };

  $scope.hideSchoolOnMap = function(){

      Map.removeMarkers($scope.mapNeighbor, $scope.schoolMarkers);

  };
  // END Add Schools to Details Page Map:amoha083@fiu.edu


  // Open/Close Accordion Sections
  $scope.toggleGroup = function(group) {
    $scope.fileDetailAccordionSections[group].shown = !$scope.fileDetailAccordionSections[group].shown;
    // $ionicScrollDelegate.scrollBy(0, 60, true);
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  var NAV_HEIGHT = 110;

  $(window).scroll(function() {
    if ($(window).scrollTop() > 25) {
      $('#detail-nav').css({
        'position': 'fixed',
        'top': 0,
        'width': '100%',
        'box-shadow': '0px 2px 4px rgba(0,0,0,0.5)'
      });
    } else {
      $('#detail-nav').css({
        'position': 'relative',
        'box-shadow': 'none'
      });
    }
  });

  var shortcuts = [
    "#photos",
    "#facts",
    "#pricing",
    "#neighborhood",
    "#contact",
    "#similar",
    "#amenities"
  ];

  var currentShortcut = 0;

  $scope.prevShortcut = function() {
    currentShortcut -= 1;
    if (currentShortcut < 0) {
      currentShortcut = 0;
      $('html, body').animate({
        scrollTop: 0
      }, 1000);
    } else {
      $('html, body').animate({
        scrollTop: $(shortcuts[currentShortcut]).offset().top - NAV_HEIGHT
      }, 1000);
    }
  }
  $scope.nextShortcut = function() {
    currentShortcut += 1;
    if (currentShortcut >= shortcuts.length) {
      // $('html, body').animate({
      //     scrollTop: $("#similar").offset().top-NAV_HEIGHT
      // }, 1000);
      currentShortcut = shortcuts.length - 1;
    } else {
      $('html, body').animate({
        scrollTop: $(shortcuts[currentShortcut]).offset().top - NAV_HEIGHT
      }, 1000);
    }
  }
  $scope.test_123 = function() {
    console.log("test_123")
  }

  $("#photoBtn").click(function() {
    currentShortcut = 0;
    $('html, body').animate({
      scrollTop: $("#photos").offset().top - NAV_HEIGHT
    }, 1000);
  });
  $("#factsBtn").click(function() {
    currentShortcut = 1;
    $('html, body').animate({
      scrollTop: $("#facts").offset().top - NAV_HEIGHT
    }, 1000);
  });
  $("#pricingBtn").click(function() {
    currentShortcut = 2;
    $('html, body').animate({
      scrollTop: $("#pricing").offset().top - NAV_HEIGHT
    }, 1000);
  });
  $("#neighborBtn").click(function() {
    currentShortcut = 3;
    $('html, body').animate({
      scrollTop: $("#neighborhood").offset().top - NAV_HEIGHT
    }, 1000);
  });
  $("#investBtn").click(function() {
    currentShortcut = 4;
    $('html, body').animate({
      scrollTop: $("#invest").offset().top - NAV_HEIGHT
    }, 1000);
  });
  $("#ContactBtn").click(function() {
    currentShortcut = 5;
    $('html, body').animate({
      scrollTop: $("#contact").offset().top - NAV_HEIGHT
    }, 1000);
  });
  $("#similarBtn").click(function() {
    currentShortcut = 6;
    $('html, body').animate({
      scrollTop: $("#similar").offset().top - NAV_HEIGHT
    }, 1000);
  });
  $("#amenityBtn").click(function() {
    currentShortcut = 6;
    $('html, body').animate({
      scrollTop: $("#amenities").offset().top - NAV_HEIGHT
    }, 1000);
  });
  $(".detail-section-title-icon").click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1000);
  });


//START Price Charts  Brandon Cajigas:bcaji001@fiu.edu
var priceChart;
var historyChart;
var avgArea= 0;
var avgPrice = 0;

$(document).ready(function(){

  var context = document.getElementById('graph').getContext('2d');
  priceChart = new Chart(context,{
    type: 'bar',
    data: {
      labels: ['This Property', 'Local Average'],
      
       datasets: [{
         label: 'Price',
         data: [0, 0],
         backgroundColor:[
           'rgba(75, 75, 255, 0.2',
           'rgba(200, 200, 50, 0.2',
         ],
         borderColor: [
          'rgba(40, 40, 125, 0.4',
          'rgba(100, 100, 25, 0.4',
         ],
         borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes:[{
            ticks: {
              beginAtZero:true,
              display: true,
              labelString: 'Price'

            }
          }]
        }
      }
    });

    var context2 = document.getElementById('graph2').getContext('2d');
    historyChart = new Chart(context2,{
      type: 'line',
      data: {
        labels: ['2010','2011','2012','2013','2014','2015','2016','2017','2018'],
        
         datasets: [{
           label: 'Price',
           series: ['This property', 'Local Average'],
           data: [10,16,13,21,18,25,21,23,22],
           borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes:[{
              ticks: {
                beginAtZero:true,
                display: true,
                labelString: 'Price'
  
              }
            }]
          }
        }
      });
      Properties.getById($routeParams).then(function(res){
        var thisProp = res;
        Properties.getNeighborsByPostal(parseInt(thisProp.postalCode)).then(function(res) {
          var neighbors = (res.data.results);
          var numProps = 0;
          var totalArea = 0;
          var totalPrice = 0;
          for (var i in neighbors){
            totalPrice += parseInt(neighbors[i].currentPrice);
            numProps += 1;
            if (neighbors[i].sqFtTotal != null){
              totalArea += parseInt(neighbors[i].sqFtTotal);
          }
        }
        avgPrice = (totalPrice/numProps);
        avgArea = (totalArea/numProps);
        $scope.changeChart();
      });
    });
});

//Toggle chart data between total price and price per square foot
var currentChart = "square";
$scope.changeChart = function(){
  Properties.getById($routeParams).then(function(res){
    var thisProperty = res;
    var price = parseInt(thisProperty.currentPrice);
    var area = parseInt(thisProperty.sqFtTotal);


    if (currentChart == "flat"){
    priceChart.data.datasets.forEach((dataset) => {
      while (dataset.data.length > 0){
        dataset.data.pop();
      }
    })
    priceChart.data.datasets.forEach((dataset) => {
      dataset.data.push([(price/area).toFixed(2)]);
      dataset.data.push([(avgPrice/avgArea).toFixed(2)]);
    })
    priceChart.update();
    currentChart = "square";
    document.getElementById("chartHeader").innerHTML = "Price Comparison: Price per square foot";
    document.getElementById("chartButton").innerHTML = "Compare total price";
  }
  else {
    priceChart.data.datasets.forEach((dataset) => {
      while (dataset.data.length > 0){
        dataset.data.pop();
      }
    })
    priceChart.data.datasets.forEach((dataset) => {
      dataset.data.push([price.toFixed(2)]);
      dataset.data.push([avgPrice.toFixed(2)]);
    })
    priceChart.update();
    currentChart = "flat";
    document.getElementById("chartHeader").innerHTML = "Price Comparison: Total Price";
  document.getElementById("chartButton").innerHTML = "Compare by price per square foot"
  }
})
}
//END Price Charts

//START Public Transportation (Incomplete)  Brandon Cajigas:bcaji001@fiu.edu
//Transport-related variables
$scope.stepRadiusTransport = 0.1;
$scope.radiusTransportMin = 0.1;
$scope.radiusTransportMax = 1;
$scope.radiusTransport = 0;
$scope.markersTransport = [];

$scope.showTransportOnMap = function(rad){

    $scope.googleGeocode($scope.propertyAddress).then(function(res) {

      //Data of property
      $scope.geocodeData = res.data.results[0];

      var radius = rad * 1.609 //miles to kilometers for Haversine Formula
      $scope.clearFeaturesOnMap();
      $scope.getTransportData($scope.geocodeData.geometry.location.lat, $scope.geocodeData.geometry.location.lng, radius);
    });
}

$scope.getTransportData = function(lat, lng, rad){
  $http.get('../scripts/transportation/TransportStops.json').then(function(res){

    for (var i = 0; i < res.data.features.length; i++){//var i in res.data.features){
      if ($scope.calculateDistance(lat, lng, res.data.features[i].properties.stop_lat, res.data.features[i].properties.stop_lon) <= rad){
        var stopCoords = []
        stopCoords.push([res.data.features[i].properties.stop_lat, res.data.features[i].properties.stop_lon]);
        var stopMarker = Map.showMarkersWithImage($scope.mapNeighbor, stopCoords, '../images/map/house.png');
        //stopMarker[0].bindPopup("<strong>Address: </strong>" + $scope.geocodeData.formatted_address).openPopup();
        $scope.markersTransport.push(stopMarker);
      }
    }
  });
}

//Calculate distance between two sets of coordinates using the Haversine Formula
$scope.calculateDistance = function(lat1, lng1, lat2, lng2){
  var R = 6371; //Earth's radius 

  //Convert from degrees to radians
  lat1=lat1*Math.PI/180; lng1=lng1*Math.PI/180; lat2=lat2*Math.PI/180; lng2=lng2*Math.PI/180;
  
  var diffLat = (lat2-lat1) 
  var diffLng = (lng2-lng1) 
  var a = Math.sin(diffLat/2) * Math.sin(diffLat/2) + 
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(diffLng/2) * Math.sin(diffLng/2);  
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var dist = R * c;
  return dist; 
  }

  //Clear map
  $scope.clearMapTransport = function() {
    //Removes markers added before
    for (var i = 0; i < $scope.markersTransport.length; i++) {
      Map.removeMarkers($scope.mapNeighbor, $scope.markersTransport[i]);
    }
  }

  

//END Public Transportation

  /*
   *BreazeHome: Neighborhood Indexes
   *
   *
   *Made by:
   *Alejandro Torros
   *Gabriel Araujo
   *Nestor Hernandez
   *Sumi Johnes
   */

  //Initial Data for Indexes
  $scope.propertyData = undefined;
  $scope.geocodeData = undefined;
  $scope.crimeData = undefined;
  // $scope.trafficData = undefined;
  $scope.floodData = undefined;
  $scope.hurricaneData = undefined;
  $scope.wildfireData = undefined;

  //Initial Values for Indexes
  $scope.crimeRating = 'Unavailable';
  // $scope.trafficRating = 'Unavailable';
  $scope.floodRating = 'Unavailable';
  $scope.hurricaneRating = 'Unavailable';
  $scope.wildfireRating = 'Unavailable';

  //Total of years for NOAA Indexes
  $scope.totalFloodYears = 10;
  $scope.totalHurricaneYears = 20;
  $scope.totalWildfireYears = 10;

  //Crime Calculation
  $scope.crimeCalc = function(crimeData) {
    var crimeTotal = 0;

    for (var i = 0; i < crimeData.length; i++) {
      crimeTotal++;
    }

    // console.log('Total Crimes: ' + crimeTotal);

    if (crimeTotal == 0) {
      $scope.crimeRating = 'Unavailable';
    } else if (crimeTotal > 0 && crimeTotal < 5) {
      $scope.crimeRating = 'Low';
    } else if (crimeTotal >= 5 && crimeTotal <= 15) {
      $scope.crimeRating = 'Medium';
    } else if (crimeTotal > 15) {
      $scope.crimeRating = 'High';
    }
  }

  //Traffic Calculation
  // $scope.trafficCalc = function() {
  //   var trafficAvg = 0;
  //   var trafficSum = 0;
  //
  //   for (var i = 0; i < $scope.trafficData.length; i++) {
  //     trafficSum += $scope.trafficData[i].aadt;
  //   }
  //
  //   trafficAvg = trafficSum / $scope.trafficData.length;
  //
  //   console.log('Average Traffic: ' + trafficAvg);
  //
  //   if (trafficAvg == 0) {
  //     $scope.trafficRating = 'Unavailable';
  //   } else if (trafficAvg > 0 && trafficAvg < 50000) {
  //     $scope.trafficRating = 'Low';
  //   } else if (trafficAvg >= 50000 && trafficAvg <= 100000) {
  //     $scope.trafficRating = 'Medium';
  //   } else if (trafficAvg > 100000) {
  //     $scope.trafficRating = 'High';
  //   }
  // };

  //Flood Calculation
  $scope.floodCalc = function(floodData) {
    var floodAvg = null;
    var floodSum = null;

    for (var i in floodData){
      floodSum += 1;
    }

    floodAvg = floodSum / $scope.totalFloodYears;

    if (floodAvg == null) {
      $scope.floodRating = 'Unavailable';
    } else if (floodAvg >= 0 && floodAvg < 2) {
      $scope.floodRating = 'Low';
    } else if (floodAvg >= 2 && floodAvg <= 5) {
      $scope.floodRating = 'Medium';
    } else if (floodAvg > 5) {
      $scope.floodRating = 'High';
    }
  }

  //Hurricane Calculation
  $scope.hurricaneCalc = function(hurricaneData) {
    var hurricaneAvg = null;
    var hurricaneSum = null;

    for (var i in hurricaneData){
      hurricaneSum += 1;
    }

    hurricaneAvg = hurricaneSum / $scope.totalHurricaneYears;

    if (hurricaneAvg == null) {
      $scope.hurricaneRating = 'Unavailable';
    } else if (hurricaneAvg >= 0 && hurricaneAvg < .3) {
      $scope.hurricaneRating = 'Low';
    } else if (hurricaneAvg >= .3 && hurricaneAvg <= 1) {
      $scope.hurricaneRating = 'Medium';
    } else if (hurricaneAvg > 1) {
      $scope.hurricaneRating = 'High';
    }
  }

  //Hurricane Calculation
  $scope.wildfireCalc = function(wildfireData) {

    var wildfireAvg = null;
    var wildfireSum = null;

    for (var i in wildfireData){
      wildfireSum += 1;
    }

    wildfireAvg = wildfireSum / $scope.totalWildfireYears;

    if (wildfireAvg == null) {
      $scope.wildfireRating = 'Unavailable';
    } else if (wildfireAvg >= 0 && wildfireAvg < 2) {
      $scope.wildfireRating = 'Low';
    } else if (wildfireAvg >= 2 && wildfireAvg <= 5) {
      $scope.wildfireRating = 'Medium';
    } else if (wildfireAvg > 5) {
      $scope.wildfireRating = 'High';
    }
  }

  //Google Maps Geocoding by Address
  $scope.googleGeocode = function(address) {
    return $http({
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyAGFSK-qslhNIIenAVnk9paSDwjZ9SLhL4'
    }).then(function successCallback(response) {
        return response;
      },
      function errorCallback(response) {
        throw new Error('Could not get response from server');
      });
  }

  $scope.getNWSPoint = function(lat, lng){
    return $http({
      method: 'GET',
      url: 'https://api.weather.gov/points/' + lat + ',' + lng
    }).then(function successCallback(response) {
        return response;
      },
      function errorCallback(response) {
        throw new Error('Could not get response from server');
      });
  }

  $scope.getNWSZone = function(zone){
    return $http({
      method: 'GET',
      url: zone
    }).then(function successCallback(response) {
        return response;
      },
      function errorCallback(response) {
        throw new Error('Could not get response from server');
      });
  }



  //Get Crime Data from SpotCrime
  $scope.getCrimeData = function(lat, lng, rad) {
    return $http({
      method: 'JSONP',
      url: 'http://api.spotcrime.com/crimes.json?lat=' + lat + '&lon=' + lng + '&radius=' + rad + '&key=heythisisforpublicspotcrime.comuse-forcommercial-or-research-use-call-877.410.1607-or-email-pyrrhus-at-spotcrime.com',
    }).then(function successCallback(response) {
        return response;
      },
      function errorCallback(response) {
        throw new Error('Could not get response from server');
      });
  };

  //Get Flood Data from Django
  $scope.getFloodData = function(state, county) {
    if (county == "Inland Miami-Dade County"){
      county = "Miami-Dade"; //Some zones have different names in disaster data
    }
    var years = (new Date()).getFullYear() - $scope.totalFloodYears;
    return $http({
      method: 'GET',
      url: BASE_URL+'noaa/?STATE__iexact=' + state + '&YEAR__gte=' + years + '&CZ_NAME__icontains=' + county + '&EVENT_TYPE__icontains=flood'
    }).then(function successCallback(response) {
        return response;
      },
      function errorCallback(response) {
        throw new Error('Could not get response from server');
      });
  }

  //Get Hurricane Data from Django
  $scope.getHurricaneData = function(state, county) {
    if (county == "Coastal Miami-Dade County"){
      county = "Coastal Dade"; //Some zones have different names in disaster data
    }
    var years = (new Date()).getFullYear() - $scope.totalHurricaneYears;
    years = years-1;
    return $http({
      method: 'GET',
      url: BASE_URL+'noaa/?STATE__iexact=' + state + '&YEAR__gte=' + years + '&CZ_NAME__icontains=' + county + '&EVENT_TYPE__icontains=hurricane'
    }).then(function successCallback(response) {
        return response;
      },
      function errorCallback(response) {
        throw new Error('Could not get response from server');
      });
  }

  //Get Wildfire Data from Django
  $scope.getWildfireData = function(state, county) {
    if (county == "Inland Miami-Dade County"){
      county = "Inland Miami-Dade"; //Some zones have different names in disaster data
    }
    var years = (new Date()).getFullYear() - $scope.totalWildfireYears;
    return $http({
      method: 'GET',
      url: BASE_URL+'noaa/?STATE__iexact=' + state + '&YEAR__gte=' + years + '&CZ_NAME__icontains=' + county + '&EVENT_TYPE__icontains=wildfire'
    }).then(function successCallback(response) {
        return response;
      },
      function errorCallback(response) {
        throw new Error('Could not get response from server');
      });
  }

  $scope.countyPolygons = undefined;
  //Process the Neighborhood Indexes for the Property being Viewed
  Properties.getById($routeParams).then(function(res) {
    $scope.propertyData = res;

    //Format the Property's Full Address
    $scope.propertyAddress = '';

    $scope.propertyAddress = $scope.propertyAddress + $scope.propertyData.addressInternetDisplay + ', ';
    $scope.propertyAddress = $scope.propertyAddress + $scope.propertyData.city + ' ';
    $scope.propertyAddress = $scope.propertyAddress + $scope.propertyData.stateOrProvince + ', ';
    $scope.propertyAddress = $scope.propertyAddress + $scope.propertyData.postalCode;

    $scope.googleGeocode($scope.propertyAddress).then(function(res) {

      //Data of property
      $scope.geocodeData = res.data.results[0];

      //Latitude and Longitude of Property
      var lat = $scope.geocodeData.geometry.location.lat;
      var lng = $scope.geocodeData.geometry.location.lng;

      //State and County of Property
      var state = '';
      var county = '';
      var polygonCounty = '';
      var zoneName = '';

      var address_components = $scope.geocodeData.address_components;

      address_components.forEach(function(address_components) {
        if (address_components.types[0] == "administrative_area_level_1"){
          state = address_components.long_name;
        }
        else if (address_components.types[0] == "administrative_area_level_2") {
          county = address_components.long_name;
          polygonCounty = address_components.long_name;
        }
      });

      //Format the County for Search
      county = county.replace('County', '');
      county = county.trim();
      county = county.toUpperCase();

      polygonCounty = polygonCounty.replace('County', '');
      polygonCounty = polygonCounty.trim();

      $scope.getNWSPoint(lat, lng).then(function(res){
        var zone = res.data.properties.forecastZone;

        $scope.getNWSZone(zone).then(function(res){
          zoneName = res.data.properties.name;
          $scope.countyPolygons = res.data.geometry;
          if (zoneName == "Coastal Miami Dade County"){
            zoneName = "Coastal Miami-Dade County";
          }

          //Get, Calculate and Display the Flood Index
          $scope.getFloodData(state, zoneName).then(function(res) {
            $scope.floodData = res.data.results;
            $scope.floodCalc($scope.floodData);
          });
            //Get, Calculate and Display the Wildfire Index
            $scope.getWildfireData(state, zoneName).then(function(res) {
            $scope.wildfireData = res.data.results;
            $scope.wildfireCalc($scope.wildfireData);
            });
          //Get, Calculate and Display the Hurricane Index
          $scope.getHurricaneData(state, zoneName).then(function(res) {  
            $scope.hurricaneData = res.data.results;
            $scope.hurricaneCalc($scope.hurricaneData);
          });
          
        });
      });


      //Get, Calculate and Display the Crime Index
      $scope.getCrimeData(lat, lng, 0.01).then(function(res) {
        //console.log('Crime GET');
        //console.log(res);
        $scope.crimeData = res.data.crimes;
        // console.log($scope.crimeData);
        $scope.crimeCalc($scope.crimeData);
      });
    });
  });

  //Crime related variables
  $scope.stepRadiusCrime = 0.25;
  $scope.radiusCrimeMin = 1;
  $scope.radiusCrimeMax = 10;
  $scope.radiusCrime = 0;
  $scope.markersCrimes = [];
  $scope.radiusCrimes = undefined;
  $scope.legendCrimes = undefined;

  //Deletes legend crime on map
  $scope.deleteLegendCrime = function() {
    if ($scope.legendCrimes != undefined) {
      $scope.mapNeighbor.removeControl($scope.legendCrimes);
      $scope.legendCrimes = undefined;
    }
  }

  //Clear map
  $scope.clearMapCrimes = function() {
    //Removes markers added before
    for (var i = 0; i < $scope.markersCrimes.length; i++) {
      Map.removeMarkers($scope.mapNeighbor, $scope.markersCrimes[i]);
    }
    //Removes radius on map
    Map.removeCircle($scope.mapNeighbor, $scope.radiusCrimes);
  }

  /**
   * HIDE CRIMES
   */
  $scope.hideCrimesOnMap = function() {
    $scope.clearFeaturesOnMap();
  }

  /**
   * SHOW CRIMES
   */
  $scope.showCrimesOnMap = function(rad) {
    //Clear map
    $scope.clearFeaturesOnMap();

    $scope.googleGeocode($scope.propertyAddress).then(function(res) {

      //Data of property
      $scope.geocodeData = res.data.results[0];

          //Creates legend
    if ($scope.legendCrimes == undefined) {
      var titleLeyend = "Crime Type";
      var symbology = [];
      symbology.push({
        name: "Arrest",
        icon: "../images/map/Arrest.png"
      });
      symbology.push({
        name: "Arson",
        icon: "../images/map/Arson.png"
      });
      symbology.push({
        name: "Assault",
        icon: "../images/map/Assault.png"
      });
      symbology.push({
        name: "Burglary",
        icon: "../images/map/Burglary.png"
      });
      symbology.push({
        name: "Robbery",
        icon: "../images/map/Robbery.png"
      });
      symbology.push({
        name: "Shooting",
        icon: "../images/map/Shooting.png"
      });
      symbology.push({
        name: "Theft",
        icon: "../images/map/Theft.png"
      });
      symbology.push({
        name: "Vandalism",
        icon: "../images/map/Vandalism.png"
      });
      symbology.push({
        name: "Other",
        icon: "../images/map/Other.png"
      });
      $scope.legendCrimes = Map.addLegendOnMap(titleLeyend, symbology);
      $scope.legendCrimes.addTo($scope.mapNeighbor);
    }

    //Creates markes for crimes
    var radius = rad / 100;
    // console.log('Radius: ' + radius);
    $scope.getCrimeData($scope.geocodeData.geometry.location.lat, $scope.geocodeData.geometry.location.lng, radius).then(function(res) {
      // console.log("Crimes GET");
      $scope.crimeData = res.data.crimes;
      $scope.crimeCalc($scope.crimeData);

      //Creates marker for property
      var coordsProperty = [];
      coordsProperty.push([$scope.geocodeData.geometry.location.lat, $scope.geocodeData.geometry.location.lng]);
      var propertyMarker = Map.showMarkersWithImage($scope.mapNeighbor, coordsProperty, '../images/map/house.png');
      propertyMarker[0].bindPopup("<strong>Address: </strong>" + $scope.geocodeData.formatted_address).openPopup();
      $scope.markersCrimes.push(propertyMarker);

      //Loop in data crimes received
      for (var i = 0; i < $scope.crimeData.length; i++) {
        var infoCrime = "<strong>Type: </strong>" + $scope.crimeData[i].type + "<br>";
        infoCrime += "<strong>Address: </strong>" + $scope.crimeData[i].address + "<br>";
        infoCrime += "<strong>Date: </strong>" + $scope.crimeData[i].date + "<br>";
        infoCrime += "<a href='" + $scope.crimeData[i].link + "'>" + $scope.crimeData[i].link + "</a>";

        var coordsCrime = [];
        coordsCrime.push([$scope.crimeData[i].lat, $scope.crimeData[i].lon]);
        var iconCrime = "../images/map/" + $scope.crimeData[i].type + ".png";
        var markerCrime = Map.showMarkersWithImage($scope.mapNeighbor, coordsCrime, iconCrime, infoCrime);
        markerCrime[0].bindPopup(infoCrime);
        $scope.markersCrimes.push(markerCrime);
      }
      //Creates radius (circle on map)
      $scope.radiusCrimes = Map.drawCircleOnMap($scope.mapNeighbor, $scope.geocodeData.geometry.location.lat, $scope.geocodeData.geometry.location.lng, rad, $scope.crimeRating);

    });
    });
  }

  //Show Flood Map Interaction

  $scope.floodPolygon = undefined;
  $scope.floodMarkers = [];

  $scope.clearMapFloods = function() {
    //Removes markers added before
    for (var i = 0; i < $scope.floodMarkers.length; i++) {
      Map.removeMarkers($scope.mapNeighbor, $scope.floodMarkers[i]);
    }
    //Removes radius on map
    Map.removeCounty($scope.mapNeighbor, $scope.floodPolygon);
  }

  $scope.hideFloodsOnMap = function() {
    $scope.clearFeaturesOnMap();
  }

  $scope.showFloodsOnMap = function() {


      $scope.googleGeocode($scope.propertyAddress).then(function(res) {
  
        //Data of property
        $scope.geocodeData = res.data.results[0];


    $scope.clearFeaturesOnMap();

    var county = '';
    var address_components = $scope.geocodeData.address_components;

    address_components.forEach(function(address_components) {
      if (address_components.types[0] == "administrative_area_level_2") {
        county = address_components.long_name;
      }
    });

    //Format the County for Search
    county = county.replace('County', '');
    county = county.trim();

    //Creates marker for property
    var coordsProperty = [];
    coordsProperty.push([$scope.geocodeData.geometry.location.lat, $scope.geocodeData.geometry.location.lng]);
    var propertyMarker = Map.showMarkersWithImage($scope.mapNeighbor, coordsProperty, '../images/map/house.png');
    propertyMarker[0].bindPopup("<strong>Address: </strong>" + $scope.geocodeData.formatted_address).openPopup();
    $scope.floodMarkers.push(propertyMarker);

    $scope.floodPolygon = Map.drawCountyOnMap($scope.mapNeighbor, county, $scope.countyPolygons, $scope.floodRating);
      });

  }

  //Show Hurricane Map Interaction

  $scope.hurricanePolygon = undefined;
  $scope.hurricaneMarkers = [];

  $scope.clearMapHurricanes = function() {
    //Removes markers added before
    for (var i = 0; i < $scope.hurricaneMarkers.length; i++) {
      Map.removeMarkers($scope.mapNeighbor, $scope.hurricaneMarkers[i]);
    }
    //Removes radius on map
    Map.removeCounty($scope.mapNeighbor, $scope.hurricanePolygon);
  }

  $scope.hideHurricanesOnMap = function() {
    $scope.clearFeaturesOnMap();
  }

  $scope.showHurricanesOnMap = function() {

      $scope.googleGeocode($scope.propertyAddress).then(function(res) {
  
        //Data of property
        $scope.geocodeData = res.data.results[0];

        $scope.clearFeaturesOnMap();
        $http.get('../scripts/geojson/floridaCounties.json').then(function(res) {
    
          var county = '';
          var address_components = $scope.geocodeData.address_components;
    
          address_components.forEach(function(address_components) {
            if (address_components.types[0] == "administrative_area_level_2") {
              county = address_components.long_name;
            }
          });
    
          //Format the County for Search
          county = county.replace('County', '');
          county = county.trim();
    
          //Creates marker for property
          var coordsProperty = [];
          coordsProperty.push([$scope.geocodeData.geometry.location.lat, $scope.geocodeData.geometry.location.lng]);
          var propertyMarker = Map.showMarkersWithImage($scope.mapNeighbor, coordsProperty, '../images/map/house.png');
          propertyMarker[0].bindPopup("<strong>Address: </strong>" + $scope.geocodeData.formatted_address).openPopup();
          $scope.hurricaneMarkers.push(propertyMarker);
    
          $scope.hurricanePolygon = Map.drawCountyOnMap($scope.mapNeighbor, county, $scope.countyPolygons, $scope.hurricaneRating);
        });
      });

  }

  //Show Wildfire Map Interaction

  $scope.wildfirePolygon = undefined;
  $scope.wildfireMarkers = [];


  $scope.clearMapWildfires = function() {
    //Removes markers added before
    for (var i = 0; i < $scope.wildfireMarkers.length; i++) {
      Map.removeMarkers($scope.mapNeighbor, $scope.wildfireMarkers[i]);
    }
    //Removes radius on map
    Map.removeCounty($scope.mapNeighbor, $scope.wildfirePolygon);
  }

  $scope.hideWildfiresOnMap = function() {
    $scope.clearFeaturesOnMap();
  }

  $scope.showWildfiresOnMap = function() {

      $scope.googleGeocode($scope.propertyAddress).then(function(res) {
  
        //Data of property
        $scope.geocodeData = res.data.results[0];
        $scope.clearFeaturesOnMap();
        $http.get('../scripts/geojson/floridaCounties.json').then(function(res) {
    
          var county = '';
          var address_components = $scope.geocodeData.address_components;
    
          address_components.forEach(function(address_components) {
            if (address_components.types[0] == "administrative_area_level_2") {
              county = address_components.long_name;
            }
          });
    
          //Format the County for Search
          county = county.replace('County', '');
          county = county.trim();
    
          //Creates marker for property
          var coordsProperty = [];
          coordsProperty.push([$scope.geocodeData.geometry.location.lat, $scope.geocodeData.geometry.location.lng]);
          var propertyMarker = Map.showMarkersWithImage($scope.mapNeighbor, coordsProperty, '../images/map/house.png');
          propertyMarker[0].bindPopup("<strong>Address: </strong>" + $scope.geocodeData.formatted_address).openPopup();
          $scope.wildfireMarkers.push(propertyMarker);
    
          $scope.wildfirePolygon = Map.drawCountyOnMap($scope.mapNeighbor, county, $scope.countyPolygons, $scope.wildfireRating);
        });
      });

    /*$scope.clearFeaturesOnMap();
    $http.get('../scripts/geojson/floridaCounties.json').then(function(res) {

      var county = '';
      var address_components = $scope.geocodeData.address_components;

      address_components.forEach(function(address_components) {
        if (address_components.types[0] == "administrative_area_level_2") {
          county = address_components.long_name;
        }
      });

      //Format the County for Search
      county = county.replace('County', '');
      county = county.trim();

      //Creates marker for property
      var coordsProperty = [];
      coordsProperty.push([$scope.geocodeData.geometry.location.lat, $scope.geocodeData.geometry.location.lng]);
      var propertyMarker = Map.showMarkersWithImage($scope.mapNeighbor, coordsProperty, '../images/map/house.png');
      propertyMarker[0].bindPopup("<strong>Address: </strong>" + $scope.geocodeData.formatted_address).openPopup();
      $scope.wildfireMarkers.push(propertyMarker);

      $scope.wildfirePolygon = Map.drawCountyOnMap($scope.mapNeighbor, county, $scope.countyPolygons, $scope.wildfireRating);
    });*/

  }

  $scope.clearFeaturesOnMap = function() {
    $scope.deleteLegendCrime();
    $scope.clearMapCrimes();
    $scope.clearMapFloods();
    $scope.clearMapHurricanes();
    $scope.clearMapWildfires();
    $scope.clearMapTransport();
  }
  //Neighborhood Indexes: End of Code

  //Mortgage
  var M; //monthly mortgage payment
  var I = 3.83 / 100 / 12; //monthly interest rate
  var N = 30 * 12; //number of payments months
  //monthly mortgage payment
  $scope.mortgage = monthlyPayment(N, I);
  function monthlyPayment(n, i) {
    return i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  }

});
