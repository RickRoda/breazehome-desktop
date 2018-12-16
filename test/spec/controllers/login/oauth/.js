'use strict';

describe('Controller: LoginOauthCtrl', function () {

  // load the controller's module
  beforeEach(module('breazehomeDesktop'));

  var LoginOauthCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginOauthCtrl = $controller('LoginOauthCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LoginOauthCtrl.awesomeThings.length).toBe(3);
  });
});
