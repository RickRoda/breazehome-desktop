'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:LandingCtrl
 * @description
 * # LandingCtrl
 * Controller of the breazehomeDesktop
 */
angular.module('breazehomeDesktop').controller('LandingCtrl', function ($scope, $rootScope, $localStorage, $location, Bilingual, Users, ModalService, Map, Properties, $window, oauth, Chat, Themes, Questions, toasts) {

  Questions.getQuestions().then((res) => {
    $scope.questions = res.data.results;
});

  // var addressit = require('addressit');
  $scope.search = { text: ''};
  $scope.text = '';
  if($location.path()==='/' || $location.path()==='/landing') {
    $rootScope.navbarHide = true;
  }

  $scope.properties = [1,2,3];

  $('body').css('overflow', 'auto');

  $scope.$on('$locationChangeStart', function( event ) {
    $rootScope.navbarHide = false;
  });

  $rootScope.storage = $localStorage;
  Bilingual.getLanguage('English');

  // ############## Map init ##############
  // Map.initMap("map2")

  Properties.getAll().then(function(res){
    var properties = res.data.results;
  });

  $scope.switchLanguage = function() {
    Bilingual.changeLanguage();
  }

  // ############## Login Methods ##############
  $scope.loginParams = {};

  // Open Login panel
  $scope.toggleLogin = function() {
    $scope.loginShow = $scope.loginShow?false:true;
    $scope.loginArrow = $scope.loginArrow?false:true;
  }

  // Log out current user
  // $scope.toggleLogout = function() {
  //   Users.logout().then(res => {
  //     window.location.href = '/#/landing'
  //   })
  // }

  // Attempt to login user
  $scope.login = function(){
    $scope.loginParams.email = $scope.loginParams.username;
    Users.login($scope.loginParams).then(res =>{

      // Successful login, set auth token and get user
      if(res.status === 200){
      const token = res.data.key;
      Users.setAuthToken(token);
      Users.get().then(res => {
        $rootScope.user = res.data
      Chat.connectToSocket().then(() => {
        Chat.connectToChannel('lobby').then((channel) => {
        $rootScope.lobbyMessages = Chat.getMessages()
      $rootScope.lobbyChannel = channel
      Users.createSavedList($rootScope.user.id).then((res) =>{
        console.log('created list', res)
    })
    })
    })
    })
      //$window.location.href = '/#/results';
    }

    // Unsuccessful login, show error modal
  else {
      $scope.loginError = res.data;
      ModalService.showModal({
        templateUrl: "views/modals/login-incorrect.html",
        controller: "LandingCtrl",
        scope: $scope
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {});
      });
    }
    toasts.show("Welcome!");
    $scope.loginShow = $scope.loginShow?false:true;
  })
  }

  // ############## Logout Methods ##############
  $rootScope.logout = function(){
    console.log("LANDING LOGOUT")
    Users.logout().then(res => {
      $rootScope.lobbyMessages = []
    $rootScope.lobbyChannel = null
    window.location.href = '/#/landing'
  })
  }

  // ############## Registration Methods ##############

  // Open registration modal
  $scope.showRegistrationModal = function() {

    $scope.registrationParams = {
      email: null,
      password1: null,
      password2: null,
      answer : null
    };

    ModalService.showModal({
      templateUrl: "views/modals/registration.html",
      controller: "LandingCtrl"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {});
    });
  };

  /**
   * @description This is used to show the rese-password modal
   */
  $scope.showResetPasswordModal = function(e){
    e.preventDefault()
    $scope.resetPassword = {
      email: '',
    };
    ModalService.showModal({
      templateUrl: "views/modals/reset-password.html",
      controller: "LandingCtrl",
      scope: $scope
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
      });
    });
  }

  /**
   * @name #2490&#2491 Ronny Alfonso ralfo040@fiu.edu
   * Evens to show/hide password
   * @param {*}
   */
  $scope.showPassword = false;

  $scope.onMouseLeave = function ($event) {
    $scope.showPassword = false;
  };

  $scope.onMouseOver = function ($event) {
    $scope.showPassword = true;
  };

  /**
   * @name #2491 Ronny Alfonso ralfo040@fiu.edu
   * This is used to confirm user's email and send an email with a
   * token to the user's email account. If the email is found
   * then the user is allowed to continue to the next step
   */
  $scope.resetUserPassword = function(){
    Users.resetPassword($scope.resetPassword.email).then(res => {
      if(res.status === 200){
      $scope.token = '';
      ModalService.showModal({
        templateUrl: "views/modals/token-request.html",
        controller: "LandingCtrl",
        scope: $scope
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) { })
      })
    }
  })
  }

  /**
   * @name #2491 Ronny Alfonso ralfo040@fiu.edu
   * @description This is used to enter the token that was
   * sent to the user's email when started the reseting
   * password process. If the token matches then the user
   * passes to the question step
   * otherwise show message
   */
  $scope.confirmUserToken = function () {
    $scope.userToken = {
      email : $scope.resetPassword.email,
      token : $scope.token
    };
    Users.confirmToken($scope.userToken).then(res => {
      if (res.status === 200) {

      // Token matches in the backend, next step ask the security question
      $scope.getUserQuestion(res.data.detail);
    }
    // Token did not match show error
  else {
      $scope.failModal = {
        title: "Error",
        message: "Your token did not match our records. Try again from the begining."
      }
      ModalService.showModal({
        templateUrl: "views/modals/fail.html",
        controller: "LandingCtrl",
        scope: $scope
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) { });
      });
    }
  })
  }

  /**
   * @name #2491 Ronny Alfonso ralfo040@fiu.edu
   * @description This is used to retrieve the security question used by
   * the user when registered
   * if found open a modal to answer the question
   * otherwise do nothing
   */
  $scope.getUserQuestion = function(question){
    $scope.answerQuestion = {
      question : question,
      answer : '',
    }

    ModalService.showModal({
      templateUrl: "views/modals/answer-question.html",
      controller: "LandingCtrl",
      scope: $scope
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {})
    })
  }

  /**
   * @name #2491 Ronny Alfonso ralfo040@fiu.edu
   * @description This is used to start the process of reseting the password
   * to reset the password the user needs to confirm user name(email) and the
   * answer used in the registration process
   * if they match show the change-password modal
   * if they dont: do nothing
   * This method was modified almost entirely
   */
  $scope.confirmUserAnswer = function(){

    var paramReset = {
      email: $scope.resetPassword.email,
      answer: $scope.answerQuestion.answer
    };

    // This checks that the question and answer match in the backend
    Users.confirmAnswer(paramReset).then(res =>{
      if(res.status === 200){
      // If they matched, then proceed to change the password in the backend
      $scope.changePasswordParams = {
        email : $scope.resetPassword.email,
        new_password : ''
      };
      // Show modal to create a new password
      ModalService.showModal({
        templateUrl: "views/modals/change-password.html",
        controller: "LandingCtrl",
        scope: $scope
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {});
      });
    }
  else {
      $scope.failModal = {
        title: "Error",
        message: "Your answer didn't march our records."
      }
      ModalService.showModal({
        templateUrl: "views/modals/fail.html",
        controller: "LandingCtrl",
        scope: $scope
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {});
      });
    }

  })
  }
  // END #2491

  /**
   * @name #2491 Ronny Alfonso ralfo040@fiu.edu
   * @description This is used to change the password in the backend
   * Will validate the passwords before send them to the backend,
   * make a POST to the db endpoint with the user-email and the two passwords
   * either shows a succeful msg or show error
   */
  $scope.changeUserPassword = function(){

    // Prepare parameters to be sent to the back-end
    var changePasswordParams = {
      email : $scope.changePasswordParams.email,
      new_password : $scope.changePasswordParams.new_password,
    };
    // This changes the password in the backend
    Users.changePassword(changePasswordParams).then(res => {
      if(res.status === 200){
      // Password changed succefully
      $scope.successModal = {
        title: "Password changed",
        message: "Your password has been succefully changed, you may proceed to login. "
      }
    }
  else{
      $scope.successModal = {
        title: "Error",
        message: "There was an error changing your password, try again later."
      }
    }

    ModalService.showModal({
      templateUrl: "views/modals/success.html",
      controller: "LandingCtrl",
      scope: $scope
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {});
    });
  })
  }
  // END #2491


  /**
   * @name #2490 Ronny Alfonso ralfo040@fiu.edu
   * @description Used to register the new user
   * Will validate the passwords first,
   * send a post to the backend endpoint,
   * either log the user or show error back
   * Added initial validation and additional data for registering
   */
  $scope.registerUser = function() {
    // If the passwords don't match show error with modal and exit
    const params = {
      username: $scope.registrationParams.email,
      email: $scope.registrationParams.email,
      password1: $scope.registrationParams.password,
      password2: $scope.registrationParams.password,
      question: $scope.selected != null ? $scope.selected.id : 1,
      answer: $scope.selected != null ? $scope.registrationParams.answer : '8'
    }



    Users.register(params).then(res => {
      // Successful Registration, log user in
      if(res.status === 201){
      Users.setAuthToken(res.data.key);
      Users.get().then(res => {
        $rootScope.user = res.data;
      Users.createSavedList($rootScope.user.id).then((res)=> {
      })
    })
      $window.location.href = '/#/profile';
    }
    // Unsuccessful Registration, show error modal
  else {
      $scope.registrationError = res.data;
      ModalService.showModal({
        templateUrl: "views/modals/registration-incorrect.html",
        controller: "LandingCtrl",
        scope: $scope
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {});
      });
    }
  })
  }
  // END #2490



  // Search home results
  $scope.submitSearch = function() {
    if($scope.selectedAutocomplete === undefined) {
      $location.path("/results/");
    }

    if($scope.selectedAutocomplete !== undefined) {
      $location.path("/results/"+$scope.selectedAutocomplete);
    }

    var id = $scope.search.text;
    var address = $scope.search_text
    console.log("VVVVVVVV***VVVVVVVV    id:" + id);
    console.log(address);
    console.log($scope.search.text);
    //Properties.getById(id);

//original
    // var parsed = addressit($scope.search.text);
    var parsed = {};
    var params = {};

    // Properties.setSearch(parsed, params);
    //console.log(parsed);
    //console.log("what is the query?");
    //console.log($scope.search.text);
    //$location.path("/results");
    //$location.path("/results/"+id);
    //$location.path("/results/"+selectId);
  }






  var filter={};
  var priceRange = [
    0,
    1000,
    10000,
    100000,
    150000,
    200000,
    250000,
    1000000,
    10000000
  ];
  $scope.selectPrice = function(num) {
    var min, max;
    $("#rangePrice").html($("#price"+num).html());
    if(num !== 0) {
      min = priceRange[num-1];
      max = priceRange[num];
      filter.priceMin = min;
      filter.priceMax = max;
      // console.log(filter);
    }
    // getPropertiesByFilter(filter);
  }

  $scope.selectBed = function(num) {
    $("#rangeBed").html($("#bed"+num).html());
  }
  $scope.selectType = function(num) {
    $("#rangeType").html($("#type"+num).html());
  }
  $scope.selectPurp = function(num) {
    $("#rangePurp").html($("#purp"+num).html());
  }

  $scope.tab = 1;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };

  // $scope.changeTab = function(evt, tabName){
  //   var i, tabcontent, tablinks;

  //   // Get all elements with class="tabcontent" and hide them
  //   tabcontent = document.getElementsByClassName("tabcontent");
  //   for (i = 0; i < tabcontent.length; i++) {
  //       tabcontent[i].style.display = "none";
  //   }

  //   // Get all elements with class="tablinks" and remove the class "active"
  //   tablinks = document.getElementsByClassName("tablinks");
  //   for (i = 0; i < tablinks.length; i++) {
  //       tablinks[i].className = tablinks[i].className.replace(" active", "");
  //   }

  //   // Show the current tab, and add an "active" class to the button that opened the tab
  //   document.getElementById(tabName).style.display = "block";
  //   evt.currentTarget.className += " active";
  // };

  var cityDict = {
    'ATLANTIS':'ATLANTIS',
    'AVENTURA':'AVENTUR',
    'BAL HARBOUR':'BALHARBR',
    'BAL HARBOR':'BALHARBR',
    'BAY HARBOR ISLANDS':'BAYHARIS',
    'BAY HARBOR ISLAND':'BAYHARIS',
    'BAY HARBOR':'BAYHARIS',
    'BELLE GLADE':'BELLEGLA',
    'BISCAYNE PARK':'BISCPARK',
    'BISCAYNE GARDENS':'BISCGRDNS',
    'BOCA':'BOCA',
    'BOCA RATON': 'BOCA',
    'BOYNTON':'BOYNTON',
    'BOYNTON BEACH':'BOYNTON',
    'BRINY BREEZES':'BRINYBRE',
    'UN-INCORPORATED BROWARD COUNTY':'BRWDCNTY',
    'UNINCORPORATED BROWARD COUNTY':'BRWDCNTY',
    'BROWARD COUNTY':'BRWDCNTY',
    'CANAL POINT':'CANALPNT',
    'CLEWISTON':'CLEWISTON',
    'CLOUD LAKE':'CLOUDLAK',
    'COCONUT CREEK':'COCOCRK',
    'COCONUT GROVE':'COCOGROV',
    'COOPER':'COOPERCI',
    'COOPER CITY':'COOPERCI',
    'CORAL GABLES':'CORALGBL',
    'CORAL SPRINGS':'CORALSPR',
    'CRANDON PARK':'CRANDPRK',
    'CUTLER BAY':'CUTLRBAY',
    'UNINCORPORATED DADE COUNTY':'DADECNTY',
    'UN-INCORPORATED DADE COUNTY':'DADECNTY',
    'DANIA BEACH':'DANIABCH',
    'DAVIE':'DAVIE',
    'DEERFIELD BEACH':'DEERFLD',
    'DELRAY BEACH':'DELRAY',
    'DORAL':'DORAL',
    'EASTERN SHORES':'EASTERNS',
    'EL PORTAL':'ELPORTAL',
    'FELLSMERE':'FELLSMER',
    'FISHER ISLAND':'FISHISLD',
    'FLORIDA CITY':'FLACITY',
    'FORT LAUDERDALE':'FORTLAUD',
    'FT. LAUDERDALE':'FORTLAUD',
    'FT LAUDERDALE':'FORTLAUD',
    'FORT PIERCE':'FTPIERCE',
    'FT. PIERCE':'FTPIERCE',
    'FT PIERCE':'FTPIERCE',
    'GIFFORD':'GIFFORD',
    'GLEN RIDGE':'GLENRIDG',
    'GOLDEN BEACH':'GOLDNBCH',
    'GOULDS':'GOULDS',
    'GREEN ACRES':'GREENACR',
    'GULFSTREAM':'GULFSTRE',
    'GULFVIEW':'GULFVIEW',
    'HALLANDALE':'HALLNDLE',
    'HAVERHILL':'HAVERHIL',
    'HIALEAH':'HIALEAH',
    'HIALEAH GARDENS':'HIALGRDN',
    'HIGHLAND BEACH':'HIGHLAND',
    'HILLSBORO BEACH':'HILLSBRO',
    'HOBE SOUND':'HOBESOUN',
    'HOLLYWOOD':'HOLLYWD',
    'HOMESTEAD':'HOMESTED',
    'HUTCHINSON BEACH':'HUTCHNSN',
    'HYPOLUXO':'HYPOLUXO',
    'INDIAN CREEK':'INDCREEK',
    'INDIAN RIVER SHORES':'INDRIVSH',
    'INDIAN TOWN':'INDTOWN',
    'ISLANDS':'ISLCARBN',
    'CARIBBEAN':'ISLCARBN',
    'JENSEN BEACH':'JENSNBCH',
    'JUNO BEACH':'JUNO',
    'JUPITER INLET COLONY':'JUPINLET',
    'JUPITER INLET':'JUPINLET',
    'JUPITER':'JUPITER',
    'KENDALL':'KENDALL',
    'KEY BISCAYNE':'KEYBISCY',
    'LAKE CLARKE SHORES':'LAKECLAR',
    'LAKE PARK':'LAKEPARK',
    'LAKE WORTH':'LAKEWORT',
    'LANTANA':'LANTANA',
    'LAUDERDALE BY THE SEA':'LAUDBSEA',
    'LAUDERHILL':'LAUDHILL',
    'LAUDERDALE LAKES':'LAUDLAKE',
    'LAZY LAKE':'LAZYLAKE',
    'LIGHTHOUSE POINT':'LHPOINT',
    'LAKEWOOD PARK':'LKWDPRK',
    'LOXAHATCHEE':'LOXAHAT',
    'MANALAPAN':'MANALAPA',
    'MANGONIA PARK':'MANGONIA',
    'MARGATE':'MARGATE',
    'MEDLEY':'MEDLEY',
    'MIAMI':'MIAMI',
    'MIAMI BEACH':'MIAMIBCH',
    'MIAMI GARDENS':'MIAMIGAR',
    'MIAMI LAKES':'MIAMILKE',
    'MIAMI SHORES':'MIAMISHR',
    'MIAMI SPRINGS':'MIAMISPR',
    'MIRAMAR':'MIRAMAR',
    'NARANJA':'NARANJA',
    'NORTH BAY VILLAGE':'NBAYVLGE',
    'NORTH LAUDERDALE':'NLAUDER',
    'NORTH MIAMI':'NMIAMI',
    'NORTH MIAMI BEACH':'NMIAMIBCH',
    'NORTH PALM BEACH':'NPALMBEA',
    'OAKLAND PARK':'OAKPARK',
    'OCEAN RIDGE':'OCEANRID',
    'OPALOCKA':'OPALOCKA',
    'OPA-LOCKA':'OPALOCKA',
    'OPA LOCKA':'OPALOCKA',
    'OTHER':'OTHER',
    'OTHERCTY':'OTHERCTY',
    'OTHERFLA':'OTHERFLA',
    'OTHERISL':'OTHERISL',
    'OTHERUSA':'OTHERUSA',
    'PAHOKEE':'PAHOKEE',
    'PALM BEACH':'PALMBEAC',
    'PALM CITY':'PALMCITY',
    'UNINCORPORATED PB COUNTY':'PALMCNTY',
    'UN-INCORPORATED PB COUNTY':'PALMCNTY',
    'PALMETTO BAY':'PALMEBAY',
    'PALM SPRINGS':'PALMSPRG',
    'PARKLAND':'PARKLAND',
    'PALM BEACH GARDENS':'PBGARDEN',
    'PALM BEACH SHORES':'PBSHORES',
    'PEMBROKE PARK':'PEMBPARK',
    'PEMBROKE PINES':'PEMBPINE',
    'PENNSUCO':'PENNSUCO',
    'PERRINE':'PERRINE',
    'PINECREST':'PINECRST',
    'PLANTATION':'PLANTATN',
    'POMPANO':'POMPANO',
    'PORT SALERNO':'PTSALERN',
    'PT. SALERNO':'PTSALERN',
    'PT SALERNO':'PTSALERN',
    'PORT SAINT LUCIE':'PTSTLUCE',
    'PORT ST. LUCIE':'PTSTLUCE',
    'PORT ST LUCIE':'PTSTLUCE',
    'PT. SAINT LUCIE':'PTSTLUCE',
    'PT. ST. LUCIE':'PTSTLUCE',
    'PT. ST LUCIE':'PTSTLUCE',
    'PT ST LUCIE':'PTSTLUCE',
    'RIVIERA BEACH':'RIVIERA',
    'ROSELAND':'ROSELAND',
    'ROYAL PALM BEACH':'ROYALPB',
    'SEA RANCH LAKES':'SEARANCH',
    'SEBASTIAN':'SEBASTN',
    'SEWALLS POINT':'SEWALLPT',
    'SINGER ISLAND':'SINGRISL',
    'SOUTH MIAMI':'SMIAMI',
    'SOBAY':'SOBAY',
    'SOUTH PALM BEACH':'SPALMBEA',
    'SAINT LUCIE WEST':'STLUCIEW',
    'ST. LUCIE WEST':'STLUCIEW',
    'ST LUCIE WEST':'STLUCIEW',
    'STUART':'STUART',
    'SUNNY ISLES BEACH':'SUNNYISL',
    'SUNNY ISLES':'SUNNYISL',
    'SUNRISE':'SUNRISE',
    'SURFSIDE':'SURFSIDE',
    'SWEETWATER':'SWEETWTR',
    'SOUTHWEST RANCHES':'SWRANCH',
    'TAMARAC':'TAMARAC',
    'TEQUESTA':'TEQUESTA',
    'TROPIC':'TROPIC',
    'VERO BEACH':'VEROBCH',
    'VIRGINIA KEY':'VIRGKEY',
    'VIRGINIA GARDENS':'VIRGRDNS',
    'VILLAGE OF GOLF':'VLGGOLF',
    'WABASSO':'WABASSO',
    'WELLINGTON':'WELLINGT',
    'WESTON':'WESTON',
    'WILTON MANORS':'WILTONMN',
    'WEST MIAMI':'WMIAMI',
    'WILLIAMS ISLAND':'WMISLAND',
    'WINTER BEACH':'WNTRBCH',
    'WEST PALM BEACH':'WPALMBEA',
    'WEST PARK':'WSTPRK'
  }
  // autocomplete code
  $scope.autocompleteData = [];

  var testAuto = []
  var testAutoId = []

  // gives another movie array on change
  $scope.updateAutocomplete = function(typed){

    // var searchData = parseAddress.parseLocation(typed);
    // console.log(searchData);
    //console.log(typed.split(/[ ,]+/));
    var typedContents = typed.split(/[ ,]+/);
    var streetMarker = ["street", "st", "st.", "avenue", "ave", "ave.", "blvd", "blvd.", "highway", "hwy", "hwy.", "box", "road", "rd", "rd.", "lane", "ln", "ln.", "circle", "circ", "circ.", "court", "ct", "ct.", "ne", "se", "nw", "sw", "n", "w", "s", "e"];
    var parsedAddress = {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      others: ""
    };


    // Check if any typed in
    var typedContentsLength = typedContents.length;
    if( typedContentsLength > 0) {
      var lastParsingItem = typedContents[typedContents.length-1];
      var firstParsingItem = typedContents[0];
      // Get last digit as zip code
      if(!isNaN(lastParsingItem) && (lastParsingItem.length <= 5)) {
        parsedAddress.zip = lastParsingItem;
      }
      parsedAddress.address1 = firstParsingItem;
      if(isNaN(firstParsingItem)) {
        parsedAddress.city = firstParsingItem;
      }
      if(typedContentsLength >= 2) {
        if(isNaN(typedContents[1]) && streetMarker.includes(typedContents[1].toLowerCase())) {
          parsedAddress.address1 += " " + typedContents[1];
        }
      }
      if(typedContentsLength >= 3) {
        if(!isNaN(typedContents[2])) {
          parsedAddress.address2 = typedContents[2];
        }
        else {
          parsedAddress.city = typedContents[2];
        }
      }
      if(typedContentsLength >= 4) {
        if(isNaN(typedContents[3]) && streetMarker.includes(typedContents[3].toLowerCase())) {
          parsedAddress.address2 += " " + typedContents[3];
        }
      }
      for(var i in typedContents) {
        if(!isNaN(typedContents[i]) && typedContents[i].length == 5) {
          parsedAddress.zip = typedContents[i];
        }
        if(isNaN(typedContents[i]) && typedContents[i].length == 2  && !streetMarker.includes(typedContents[i].toLowerCase())) {
          parsedAddress.state = typedContents[i];
        }
      }
    }


    $scope.newAutocomplete = Properties.getAutocomplete(typed);
    $scope.newAutocomplete.then(function(res){
      // var suggestionsData = res.data.suggestions.slice(0,10);
      // console.log("VVVVVVVVVVVVVVVVVVV");
      // console.log(res);
      var suggestionsData = [];
      var suggestionsId = [];
      for(var i=0; i<5; i++) {
        if(res.data.suggestions[i] === undefined) {
          break;
        }
        else {
          // START auto complete:acris005@fiu.edu
          suggestionsData[i] = res.data.suggestions[i].address_internet_display;
          /*
          suggestionsData[i] = res.data.suggestions[i].address_internet_display + ","
                              + res.data.suggestions[i].city + ","
                              + res.data.suggestions[i].state_or_province + ","
                              + res.data.suggestions[i].postal_code
          */
          suggestionsId[i] = res.data.suggestions[i].id;
        }
      }

      // END auto complete
      testAuto = suggestionsData;
      testAutoId = suggestionsId;
      $scope.autocompleteData = suggestionsData;
    });
  }



  // Search address results
  $scope.addressSearch = function() {

    // START search engine:acris005@fiu.edu

    // if autocomplete selection
    if($scope.selectedAutocomplete !== undefined) {
      var address = $scope.selectedAutocomplete;
    }

    // else use text from input box
    else {
      var address = $scope.search_text
    }

    // todo: implement whitespace function that is more clear than this
    // if address is not all whitespace
    if (address.replace(/\s/g, '').length) {

      /*
      var typedContents = address.split(/[ ,]+/);
      var streetMarker = ["street", "st", "st.", "avenue", "ave", "ave.", "blvd", "blvd.", "highway", "hwy", "hwy.", "box", "road", "rd", "rd.", "lane", "ln", "ln.", "circle", "circ", "circ.", "court", "ct", "ct.", "ne", "se", "nw", "sw", "n", "w", "s", "e"];
      var parsedAddress = {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      others: ""
      };
      */

      $scope.searchProperties = Properties.searchAddress(address);
      $scope.searchProperties.then(function(res){


        $rootScope.properties = res.data.results;
        //Map.setProperties($rootScope.properties);
        $rootScope.addrSearchFlag = "yes";
        $location.path("/results");
        // END search engine


      })
    }
  }

  $scope.selectAutocomplete = function(e) {
    // e is address fetch from autocomplete list
    for(var i=0; i<5; i++) {
      if(e == testAuto[i]) {
        $scope.selectedAutocomplete = testAutoId[i];
      }
    }

  }

  $scope.searchDefault = function() {
    $location.path("/results");
  }



  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }

  function showPosition(position) {
    // console.log(position.coords.latitude +","+position.coords.longitude);
  }

  // START property promotions Fernando Serrano:fserr010@fiu.edu

  $scope.tab = 0;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
    $scope.ready=false
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };

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

  Properties.getFiltered().then(function(res){

    $scope.filters = res.data.results.sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return obj1.order - obj2.order;
    });

    for(var i=0; i<$scope.filters.length; i++){
      if($scope.filters[i].trashed == true || $scope.filters[i].active == false){
        $scope.filters.splice(i,1)
      }
    }

    $scope.getProperties()

  })

  $scope.getProperties=function () {
    if ($scope.filters[$scope.tab] === undefined) {
      return
    }
    Properties.getByCondition($scope.filters[$scope.tab].condition).then(function(res){
      $scope.properties2 = res.data.results;
      $scope.ready=true;
    })
  }

  $scope.clickCard = function(property) {
      window.location.href = "/#/results/"+property.id;
  }
  // END property promotions Fernando Serrano:fserr010@fiu.edu

  //Eithel
  if($rootScope.toggleLogin){
    $scope.toggleLogin();
    $rootScope.toggleLogin = false;
  }

});
