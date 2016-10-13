(function ()
{
    'use strict';

    angular
        .module('app.navigation', [])
        .config(config);

        // /** @ngInject */
        // function config()
        // {
        //
        // }

    /** @ngInject */
    function config($translatePartialLoaderProvider, msNavigationServiceProvider)
    {

        $translatePartialLoaderProvider.addPart('app/navigation');

        // Navigation
        msNavigationServiceProvider.saveItem('nav', {
            title : 'PAGES',
            group : true,
            // translate: 'NAV.NAVIGATION',
            weight: 1
        });



          msNavigationServiceProvider.saveItem('nav.profiles', {
              title    : 'Profiles',
              icon     : 'icon-account',
              // state    : 'app.search',
              /*stateParams: {
               'param1': 'page'
               },
              translate: 'NAV.SEARCH',*/
              weight   : 1
          });

          // msNavigationServiceProvider.saveItem('nav.search.profile_new', {
          //     title    : 'Add New',
          // });

          msNavigationServiceProvider.saveItem('nav.profiles.dashboard', {
              title    : 'Dashboard',
              icon     : 'icon-tile-four',
               state    : 'app.dashboard',
              /*stateParams: {
               'param1': 'page'
               },
              translate: 'NAV.SEARCH',*/
              weight   : 1
          });
          
          msNavigationServiceProvider.saveItem('nav.profiles.search', {
              title    : 'Search profiles',
              icon     : 'icon-magnify',
              state    : 'app.search',
              /*stateParams: {
               'param1': 'page'
               },
              translate: 'NAV.SEARCH',*/
              weight   : 1
          });


          msNavigationServiceProvider.saveItem('nav.campaigns', {
              title    : 'Campaigns',
              icon     : 'icon-calendar-today',
              // state    : 'app.search',
              /*stateParams: {
               'param1': 'page'
               },
              translate: 'NAV.SEARCH',*/
              weight   : 1
          });

          msNavigationServiceProvider.saveItem('nav.transactional', {
              title    : 'Transactional',
              icon     : 'icon-swap-horizontal',
              // state    : 'app.search',
              /*stateParams: {
               'param1': 'page'
               },
              translate: 'NAV.SEARCH',*/
              weight   : 1
          });

          msNavigationServiceProvider.saveItem('nav.settings', {
              title    : 'Settings',
              icon     : 'icon-cog',
              // state    : 'app.search',
              /*stateParams: {
               'param1': 'page'
               },
              translate: 'NAV.SEARCH',*/
              weight   : 1
          });

          msNavigationServiceProvider.saveItem('nav.help', {
              title    : 'Help Center',
              icon     : 'icon-help-circle',
              // state    : 'app.search',
              /*stateParams: {
               'param1': 'page'
               },
              translate: 'NAV.SEARCH',*/
              weight   : 1
          });
            // msNavigationServiceProvider.saveItem('nav.profile', {
            //     title    : 'Profile',
            //     icon     : 'icon-home',
            //     state    : 'app.profile',
            //     /*stateParams: {
            //      'param1': 'page'
            //      },
            //     translate: 'NAV.PROFILE',*/
            //     weight   : 1
            // });

    }

})();
