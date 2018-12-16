'use strict';

describe('Directive: filterDropdown', function () {

  // load the directive's module
  beforeEach(module('breazehomeDesktop'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<filter-dropdown></filter-dropdown>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the filterDropdown directive');
  }));
});
