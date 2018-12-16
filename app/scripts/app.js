'use strict';

/**
 * @ngdoc overview
 * @ngdoc controller
 * @name breazehomeDesktop
 * @description
 * # breazehomeDesktop
 * Main module of the application.
 */

angular
  .module('breazehomeDesktop', [
    'breazehomeDesktop.services',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'angularModalService',
    'infinite-scroll',
    'chart.js',
    'rzModule',
    'autocomplete',
    'slick',
    'ngFileUpload',
    'ui.sortable'
  ])
  .config(function($routeProvider, $locationProvider, $sceDelegateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl',
        controllerAs: 'landing'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      // START #2357 and #2487 Andreina Rojas aroja108@fiu.edu
        .when('/addtoboard', {
        templateUrl: 'views/addtoboard.html',
        controller: 'AddToBoardCtrl',
        controllerAs: 'addtoboard'
      })
        .when('/propstoboard', {
        templateUrl: 'views/propstoboard.html',
        controller: 'PropsToBoardCtrl',
        controllerAs: 'propstoboard'
      })
      .when('/allboards', {
        templateUrl: 'views/allboards.html',
        controller: 'AllBoardsCtrl',
        controllerAs: 'allboards'
      })
      .when('/resultsfav', {
        templateUrl: 'views/resultsfav.html',
        controller: 'ResultsFavCtrl',
        controllerAs: 'resultsfav'
      })
       .when('/boards/:name', {
        templateUrl: 'views/boards.html',
        controller: 'BoardsCtrl',
        controllerAs: 'boards'
      })
      // END #2357 and #2487 Andreina Rojas aroja108@fiu.edu
      .when('/landing', {
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl',
        controllerAs: 'landing'
      })
      .when('/files', {
        templateUrl: 'views/files.html',
        controller: 'FilesCtrl',
        controllerAs: 'files'
      })
      .when('/test', {
        templateUrl: 'views/test.html',
        controller: 'TestCtrl',
        controllerAs: 'test'
      })
      .when('/themes', {
        templateUrl: 'views/themes.html',
        controller: 'ThemesCtrl',
        controllerAs: 'themes'
        })
      .when('/customizetheme', {
          templateUrl: 'views/customizetheme.html',
          controller: 'CustomizethemeCtrl',
          controllerAs: 'customizetheme'
      })
      .when('/results', {
        templateUrl: 'views/results.html',
        controller: 'ResultsCtrl',
        controllerAs: 'results'
      })
      .when('/lists', {
        templateUrl: 'views/lists.html',
        controller: 'ListsCtrl',
        controllerAs: 'lists'
      })
      .when('/results/:id', {
        templateUrl: 'views/detail.html',
        controller: 'ResultDetailCtrl',
        controllerAs: 'resultDetail'
      })
      .when('/oauth', {
        templateUrl: 'views/oauth.html',
        controller: 'OauthCtrl',
        controllerAs: 'oauth'
      })
      .when('/lists', {
        templateUrl: 'views/lists.html',
        controller: 'ListsCtrl',
        controllerAs: 'lists'
      })
      .when('/passwordreset', {
        templateUrl: 'views/passwordreset.html',
        controller: 'PasswordresetCtrl',
        controllerAs: 'passwordreset'
      })
      .when('/forgotpassword', {
        templateUrl: 'views/forgotpassword.html',
        controller: 'ForgotpasswordCtrl',
        controllerAs: 'forgotpassword'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .when('/propertypreview', {
        templateUrl: 'views/propertypreview.html',
        controller: 'propertyPreviewCtrl',
        controllerAs: 'propertyPreview'
      })
      // START property promotions Fernando Serrano:fserr010@fiu.edu
      .when('/propertypromotions', {
        templateUrl: 'views/propertyPromotions.html',
        controller: 'propertyPromotionsCtrl',
        controllerAs: 'properyPromotions'
      })

      .when('/createcustomfilters', {
        templateUrl: 'views/createcustomfilters.html',
        controller: 'createCustomFiltersCtrl',
        controllerAs: 'createCustomFilters'
      })

      // END property promotions Fernando Serrano:fserr010@fiu.edu
      // #2427 Profile implementation Ronny Alfonso ralfo040@fiu.edu
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
      })
      // END 2427
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.hashPrefix('');

    //Neighborhood Indexes: SpotCrime API WhiteListing
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://api.spotcrime.com/**'
    ]);
  })
  .run(function($rootScope, $localStorage, Users, ModalService, Properties, History, Bilingual, Chat, Themes, Admin){
    // Global login functions
    $rootScope.loginParams = {}
    // Attempt to login user
    $rootScope.login = function() {
      $rootScope.loginParams.email = $rootScope.loginParams.username;
      Users.login($rootScope.loginParams).then(res => {

        // Successful login, set auth token and get user
        if (res.status === 200) {
          $rootScope.loginParams = {};
          const token = res.data.key;
          Users.setAuthToken(token);
          Users.get().then(res => {
            $rootScope.user = res.data;
            Chat.connectToSocket().then(() => {
              Chat.connectToChannel('lobby').then((channel) => {
                $rootScope.lobbyMessages = Chat.getMessages();
                $rootScope.lobbyChannel = channel;
                $window.location.href = '/#/results';
              })
            })
          })
        }
        // Unsuccessful login, show error modal
        else {
            $rootScope.loginParams = {};
            $rootScope.loginError = res.data;
            ModalService.showModal({
                templateUrl: "views/modals/login-incorrect.html",
                controller: "AboutCtrl",
                scope: $rootScope
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) { });
            });
        }
      })
    }

    // Create global logout function
    $rootScope.logout = function() {
      Users.logout().then(res => {
        $rootScope.lobbyMessages = [];
        $rootScope.lobbyChannel = null;
        window.location.href = '/#/landing';
      })
    }

    // Check localStorage to see if user is logged in
    if (window.localStorage.getItem('user_data') !== null) {
      $rootScope.user = JSON.parse(window.localStorage.getItem('user_data'));
      Chat.connectToSocket().then(() => {
        Chat.connectToChannel('lobby').then((channel) => {
          $rootScope.lobbyMessages = Chat.getMessages();
          $rootScope.lobbyChannel = channel;
        })
      })
    }

    // Check localStorage to see if user has a token
    if (window.localStorage.getItem('user_key') !== null) {
      let token = window.localStorage.getItem('user_key');
      Users.setAuthToken(token);
    }

    angular.element(document).on("click", function(e) {
      $rootScope.$broadcast("documentClicked", angular.element(e.target));
    });

    $rootScope.applyFilter = function(search) {
      Properties.getByQueryString(search.queryString).then(function(res) {
        // console.log(res.data.results);
        $rootScope.properties = res.data.results;
        // console.log($scope.properties);
      })
    }

    $rootScope.history = {};
    // History.cleanHistory();
    History.getHistory();
    // console.log($rootScope.history.propertiesHistroy);
    // $rootScope.history = History.getHistory();
    // $rootScope.history.searchesHistroy.slice(0,2);
    // $rootScope.history.propertiesHistroy = $rootScope.history.propertiesHistroy.slice(0,3);

    // Get Bilingual system
    $rootScope.storage = $localStorage;
    Bilingual.getLanguage('English');
    $rootScope.switchLanguage = function () {
        Bilingual.changeLanguage();
    }

    // Get BreazeHome system configurations
    Admin.getSystemConfig().then((res) => {
      var systemThemeId = res.data.systemTheme
      if(systemThemeId === null) {
        return
      }
      Themes.getThemeById(systemThemeId).then((res) => {
        $rootScope.appThemes = res.data;
      })
    })
  })

  .constant('BASE_URL', SETTINGS.API_HOST)
  .constant('IMAGE_URL', SETTINGS.IMAGE_URL)
  .constant('AUTH_REDIRECT_URL_GOOGLE', SETTINGS.AUTH_REDIRECT_URL_GOOGLE)
  .constant('AUTH_REDIRECT_URL_FB', SETTINGS.AUTH_REDIRECT_URL_FB)
  .constant('CHAT_HOST', SETTINGS.CHAT_HOST)
