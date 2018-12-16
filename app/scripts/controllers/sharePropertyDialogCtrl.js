
// Social media
angular.module('breazehomeDesktop').controller('shareDialogCtrl', function(BASE_URL, $scope, Properties, $routeParams, $location, ModalService) {

    // Send Email Adrian
    $scope.sendEmail = function(recipient_email, sender_email, email_body) {
    	console.log("sharePropertyDialogController called sendEmail");

    	var params = {
              "recipient_email" : recipient_email,
              "sender_email"    : sender_email,
              "email_body"      : email_body,
              "property_url"    : $location.absUrl()
            }


      var recipientInvalidMessage = 'The recipient\'s email is invalid. Please type a valid email and try again.';
      var senderInvalidMessage    = 'The sender\'s email is invalid. Please type a valid email and try again.';

      if (!validateEmail(recipient_email)) {

    	   showAlert('Error', recipientInvalidMessage);   
      } else if (!validateEmail(sender_email)) {
         showAlert('Error', senderInvalidMessage);   
      } else {
        Properties.shareViaEmail(params).then(function(res){          
             if (res.status === 200) {            
                showAlert('Success', 'Thank you! Email has been sent.');
              } else {
               console.log("FAILURE");         
              }  

              }, function(error) {
                  console.log(error);
              });
    }}

    function showAlert(title, message) {
      $scope.successModal = {
              title: title,
              message: message
            }
            
            ModalService.showModal({
              templateUrl: "views/modals/success.html",
              controller: "shareDialogCtrl",
              scope: $scope
            }).then(function(modal) {
              modal.element.modal();
              modal.close.then(function(result) {});
            });
    } 


    function validateEmail(inputText, errorMessage) {
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;      
      return mailformat.test(inputText); 
    } 
    // end Adrian

    // Share via Tweeter Alejandro
    $scope.sendTweet = function() {
      var value = Math.round($scope.property.currentPrice);
      var uri = window.location.href;
      var res = encodeURIComponent(uri);
      var loc = $scope.property.addressInternetDisplay;
      if ($scope.property.addressInternetDisplay == null) {
        loc = 'Miami';
      };
      var bed = $scope.property.bedsTotal
      if (bed == null || bed == undefined) {
        bed = '-';
      };
      var bath = $scope.property.bathsFull
      if (bath == null || bath == undefined) {
        bath = '-';
      };
      var type = $scope.property.propertyType;
      var ftprint = $scope.property.sqFtTotal
      if (ftprint == null || ftprint == undefined) {
        ftprint = '-';
      };
      var url = "https://twitter.com/intent/tweet?text=Check%20this%20listing%20in%20" +
      loc + ", FL%20" +
      "$" + value + "%20" +
      bed + "%20" + $scope.storage.language.content.detailsPage.bedAbbrev + "%20" +
      bath + "%20" + $scope.storage.language.content.detailsPage.bathAbbrev + "%20" +
      type + "%20" + 
      ftprint + "%20" + $scope.storage.language.content.detailsPage.feetAbbrev + "%20" +
      "&url=" + res + "&hashtags=breazehome";
      window.open(url, "", "width=550,height=420");
    }
    //End Alejandro

  // Niuriset: Code to initialize connection async with Facebook
    window.fbAsyncInit = function() {
      FB.init({
        appId            : '386651755088156', // 276711329466105 -- needs to be changed
        display          : 'popup',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

  // end Niuriset

  // Niuriset: code for share to facebook 
    $scope.shareFacebook = function(){
      FB.ui(
        {
          method: 'share',
          href: 'http://www.breazehome.com/#/results/' + $scope.property.id,
          //hashtag: '#BreazeHome', -- add when tag system is ready
          //display: 'popup',
          quote: $scope.property.addressInternetDisplay + ' | MLS #'+ $scope.property.dXorigmlno +' | BreazeHome',
          //href: 'https://developers.facebook.com/docs/',
        },
        // callback
        function(response) {
          if (response && !response.error_message) {
            //alert('Posting completed.');
          } else {
            //alert('Error while posting.');
          }
        }
      );
    }
  // end Niuriset

  //Share via Google+ Alejandro
    $scope.postGooglePlus = function() {
      var value = Math.round($scope.property.currentPrice);
      var uri = window.location.href;
      var res = encodeURIComponent(uri);
      var loc = $scope.property.addressInternetDisplay;
      if ($scope.property.addressInternetDisplay == null) {
        loc = 'Miami';
      };
      var bed = $scope.property.bedsTotal
      if (bed == null || bed == undefined) {
        bed = '-';
      };
      var bath = $scope.property.bathsFull
      if (bath == null || bath == undefined) {
        bath = '-';
      };
      var type = $scope.property.propertyType;
      var ftprint = $scope.property.sqFtTotal
      if (ftprint == null || ftprint == undefined) {
        ftprint = '-';
      };
      var url = "https://plus.google.com/share?url=" + res;
      window.open(url, "", "width=480,height=480");
    }
    // End Alejandro

});