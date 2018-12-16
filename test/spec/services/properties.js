'use strict';

describe('Service: properties', function () {

  // load the service's module
  beforeEach(module('breazehomeDesktop'));

  // instantiate service
  var properties;
  beforeEach(inject(function (_properties_) {
    properties = _properties_;
  }));

  it('should do something', function () {
    expect(!!properties).toBe(true);
  });

});
