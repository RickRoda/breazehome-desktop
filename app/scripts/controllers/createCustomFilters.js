// START create custom filter controller Fernando Serrano:fserr010@fiu.edu
angular.module('breazehomeDesktop').controller('createCustomFiltersCtrl', function ($scope, $localStorage, $document, Bilingual, Properties, $rootScope, ModalService){

  // $scope.close = close;


  $scope.filterActive =[
    {name:'Active',      checked:false}
  ]
  $scope.filterFeatures = [
    { name: 'Pool', 		checked: false, conditionStr:"pets_allowed_yn=True&" },
    { name: 'Patio',		checked: false, conditionStr:"balcony_porchandor_patio_yn=True&" },
    { name: 'Balcony',		checked: false, conditionStr:"balcony_porchandor_patio_yn=True&" },
    { name: 'Waterfront',		checked: false, conditionStr:"" },
    { name: 'Porch',		checked: false, conditionStr:"" },
    { name: 'Cable',		checked: false, conditionStr:"" },
    { name: 'Pets',		checked: false, conditionStr:"pets_allowed_yn=True&"}
  ];
  $scope.filterTypes = [
    { name: 'Apartment',	checked: true, conditionStr:"" },
    { name: 'Condo', 		checked: true, conditionStr:"" },
    { name: 'House',		checked: true, conditionStr:"" },
    { name: 'Trailer',		checked: false, conditionStr:"" },
    { name: 'Land',			checked: false, conditionStr:"" },
    { name: 'Towndhouse',	checked: false, conditionStr:"" },
    { name: 'Other',		checked: false, conditionStr:"" }
  ];
  $scope.filterTransType = [
    { name: 'Sale',			checked: true, conditionStr:"!for_sale_yn=False&" },
    { name: 'Rent', 		checked: true, conditionStr:"" },
    { name: 'Shared',		checked: false, conditionStr:"" },
    { name: 'Lease',		checked: false,  conditionStr:"!for_lease_yn=False&"  },
    { name: 'Foreclosure',	checked: false, conditionStr:"" },
    { name: 'Sublet',		checked: false, conditionStr:"" },
    { name: 'Openhouses Only',		checked: false, conditionStr:"" }
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
      max: 5000,
      options: {
        floor: 0,
        ceil: 5000,
        rightToLeft: ($rootScope.isFarsi === true),
        step: 10
      }
    },
    totalPrice: {
      min:  0,
      max:  10000,
      options: {
        floor: 0,
        ceil: 10000,
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
      max: 100,
      options: {
        floor: 0,
        ceil: 100,
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


  $scope.conditions;

  Properties.getFiltered().then(function(res){
    $scope.conditions = res.data.results;

  })


  $scope.isActive=function(index){

    if($scope.conditions[index].active==true){
      return true;
    }
    return false;

  }
  $scope.isTrashed=function(index){

    if($scope.conditions[index].trashed==true){
      return true;
    }
    return false;

  }

  $scope.toggleActive=function (index) {

    if($scope.conditions[index].active==true){
      $scope.conditions[index].active = false;
    }
    else{
      $scope.conditions[index].active = true;
    }

  }


  $scope.setFilters=function(){
    for(var i=0; i<$scope.conditions.length; i++){
      Properties.patchFilterList($scope.conditions[i]).then(function(res) {

      })
    }

  }


  $scope.filter = {}
  $scope.filter.name=""
  $scope.filter.order=""

  $scope.saveNewFilter=function(){

    $scope.filter.condition="?"
    $scope.filter.active=false;

    for(i in $scope.filterActive){
      if($scope.filterActive[i].checked == true){
        $scope.filter.active=true;
      }
    }

    for(i in $scope.filterTypes){
      if($scope.filterTypes[i].checked == true){
        $scope.filter.condition += $scope.filterTypes[i].conditionStr;
      }
    }
    for(i in $scope.filterFeatures){
      if($scope.filterFeatures[i].checked == true){
        $scope.filter.condition += $scope.filterFeatures[i].conditionStr;
      }
    }
    for(i in $scope.filterTransType){
      if($scope.filterTransType[i].checked == true){
        $scope.filter.condition += $scope.filterTransType[i].conditionStr;
      }
    }

    $scope.filter.condition += "current_price__lte="+$scope.options.totalPrice.max*1000 + "&current_price__gte="+$scope.options.totalPrice.min*1000 + "&";
    $scope.filter.condition += "sq_ft_total__lte="+$scope.options.livingArea.max + "&sq_ft_total__gte="+$scope.options.livingArea.min + "&";
    $scope.filter.condition += "year_built__lte="+ (2018 - $scope.options.buildingAge.min) + "&year_built__gte="+ (2018 - $scope.options.buildingAge.max) + "&";


    Properties.addFilterList($scope.filter).then(function (res) {
    });
  }

})
// END Create Custom Filters Fernando Serrano
