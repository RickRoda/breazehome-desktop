'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop').controller('AdminCtrl', function (BASE_URL, $scope, $rootScope, $location, Backup, Admin) {
  
  // Make admin page scrollable and set bgcolor
  $('body').css('overflow', 'auto').css('background-color', '#F8F8F8')

  // Redirect 
  if (!$rootScope.user || !$rootScope.user.isSuperuser) {
    $location.path('/')
  }

  $rootScope.currentPage = "Admin"
  
  $scope.forms = {}
  $scope.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Get backup configurations
  $scope.backupConfig = {}
  Backup.get().then(data => $scope.backupConfig = data.data.content)

  // Set backup configurations
  $scope.handleSubmit = () => {
    Backup.put($scope.backupConfig).then(data => {
      $scope.forms.backupConfigForm.$setUntouched()
      $scope.forms.backupConfigForm.$setPristine()
    })
  }

  // Get polr configurations
  Admin.getSystemConfig().then(res => {
    res.data.polrDurationMaxTolerance = parseFloat(res.data.polrDurationMaxTolerance)
    res.data.polrMaxMpm = parseFloat(res.data.polrMaxMpm)
    $scope.polrConfig = res.data
  })

  // $scope.polrConfig = {
  //   "googleApiKey": "AIzaSyCHa5mFbTGgyAABDm_d7M4msCk1LoF53tk",
  //   "polrDurationMaxTolerance": "0.05",
  //   "polrSearchAngles": 15,
  //   "polrSearchIterations": 32,
  //   "polrMaxMpm": "1.25",
  //   "polrGoogleMatrixElementsPs": 50,
  // }

  // Set polr configurations
  $scope.polrSubmit = () => {
    Admin.setPolr($scope.polrConfig).then(res => {
      console.log(res)
    })
  }
})
