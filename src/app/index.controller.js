(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
  function IndexController($rootScope, fuseTheming, $location, $window) {

        var vm = this;

        $rootScope.params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
          $rootScope.params[key] = value;
        });

        // if (!$rootScope.params['feedId']) {
        //   $location.path('/error-404')
        // }

        // Data
        vm.themes = fuseTheming.themes;

        //////////
    }
})();
