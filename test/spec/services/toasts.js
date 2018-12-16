'use strict';

describe('Service: toasts', function () {

  // load the service's module
  beforeEach(module('breazehomeDesktop'));

  // instantiate service
  var toasts;
  beforeEach(inject(function (_toasts_) {
    toasts = _toasts_;
  }));

  it('should do something', function () {
    expect(!!toasts).toBe(true);
  });

});
