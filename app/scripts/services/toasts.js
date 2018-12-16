'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.toasts
 * @description
 * # toasts
 * Factory in the breazehomeDesktop.
 */
angular.module('breazehomeDesktop').factory('toasts', function () {

    const toast = document.querySelector('#toast');

    return {
      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.toasts
      * @name show
      * @param {string} content Content to show in toast
      * @description
      *   Show toast from view.
      */
      show: function (content) {

      	toast.getElementsByClassName('toast-content')[0].innerHTML = content;

        toast.classList.add('toast-wrapper-visible')
        setTimeout( () => {
        	toast.classList.remove('toast-wrapper-visible');
        }, 3000)
      },

      /**
      * @ngdoc method
      * @methodOf breazehomeDesktop.toasts
      * @name hide
      * @description
      *   Hide toast from view.
      */
      hide: function () {
        toast.classList.remove('toast-wrapper-visible');
      }
    };
  });
