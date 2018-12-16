'use strict';

describe('Controller: ResultDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('breazehomeDesktop'));

  var ResultDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResultDetailCtrl = $controller('ResultDetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ResultDetailCtrl.awesomeThings.length).toBe(3);
  });
});
