'use strict';

describe('Service: Bilingual', function () {

  // load the service's module
  beforeEach(module('breazehomeDesktop'));

  // instantiate service
  var Bilingual;
  beforeEach(inject(function (_Bilingual_) {
    Bilingual = _Bilingual_;
  }));

  it('should do something', function () {
    expect(!!Bilingual).toBe(true);
  });

});
