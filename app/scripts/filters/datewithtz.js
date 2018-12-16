'use strict';

/**
 * @ngdoc filter
 * @name breazehomeDesktop.DateWithTZ
 * @description
 * # Filter to get date/time with user's timezone
 */
angular.module('breazehomeDesktop').filter('dateWithTZ', () => {
  return (date) => {
    const timezone = jstz.determine().name()
    const utc = moment.tz(date, 'UTC')
    return moment(utc).tz(timezone).format()
  }
})


