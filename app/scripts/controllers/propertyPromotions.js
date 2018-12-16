// START property promotions controller Fernando Serrano:fserr010@fiu.edu
angular.module('breazehomeDesktop').controller('propertyPromotionsCtrl', function ($scope, $localStorage, $document, Bilingual, Properties, $rootScope, ModalService){




  $scope.conditions;
  $scope.ready=true;

  Properties.getFiltered().then(function(res){

    $scope.conditions = res.data.results.sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return obj1.order - obj2.order;
    });


    for(i in $scope.conditions){
      if($scope.conditions[i].trashed == true){
        $scope.conditions.splice(i,1)
      }
    }

    for(i in $scope.conditions){
      if($scope.conditions[i].trashed == true){
        $scope.conditions.splice(i,1)
      }
    }




  })

  $scope.arrowUp=function(index){
    if(index !=0){
      var temp = $scope.conditions[index].order;
      $scope.conditions[index].order = $scope.conditions[index-1].order
      $scope.conditions[index-1 ].order=temp;
    }

    $scope.conditions.sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return obj1.order - obj2.order;
    });

  }

  $scope.arrowDown=function(index){
    if(index != $scope.conditions.length-1){
      var temp = $scope.conditions[index].order;
      $scope.conditions[index].order = $scope.conditions[index+1].order
      $scope.conditions[index+1 ].order=temp;
    }

    $scope.conditions.sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return obj1.order - obj2.order;
    });

  }



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

  $scope.toggleTrashed=function (index) {


    if($scope.conditions[index].trashed==true){
      $scope.conditions[index].trashed = false;
    }
    else{
      $scope.conditions[index].trashed = true;
    }




  }
  $scope.setFilters=function(){
    for(var i=0; i<$scope.conditions.length; i++){
      Properties.patchFilterList($scope.conditions[i]).then(function(res) {

      })
    }

  }

  $scope.filterTrashed=function(item){
    return item.trashed
  }


})
// END Property promotions controller Fernando Serrano
