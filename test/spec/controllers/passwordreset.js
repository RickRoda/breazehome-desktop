'use strict';

describe('Controller: PasswordresetCtrl', function () {

  // load the controller's module
  beforeEach(module('breazehomeDesktop'));

  var PasswordresetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasswordresetCtrl = $controller('PasswordresetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PasswordresetCtrl.awesomeThings.length).toBe(3);
  });
});
