'use strict';

describe('Controller: ThemesCtrl', function () {

  // load the controller's module
  beforeEach(module('breazehomeDesktop'));

  var ThemesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThemesCtrl = $controller('ThemesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ThemesCtrl.awesomeThings.length).toBe(3);
  });
});
