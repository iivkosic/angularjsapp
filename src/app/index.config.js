(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($httpProvider, $translateProvider)
    {

      // Put your custom configurations here
       $httpProvider.interceptors.push('authInterceptor');

      // If is sanitize then it's messing up utf8 chars
      $translateProvider.useSanitizeValueStrategy('escape');

    }

})();
