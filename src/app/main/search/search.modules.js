(function ()
{
    'use strict';

    angular
        .module('app.search', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.search', {
                url    : '/search',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/search/search.html',
                        controller : 'SearchController as vm'
                    }
                },
                resolve: {
                    // SearchData: function (msApi) {
                    //     return msApi.resolve('search.data@get');
                    //   },
                    // Profiles: function(apiResolver, $rootScope, Auth) {
                    //       var clientId = Auth.authz.idTokenParsed.clientId;
                    //     return apiResolver.resolve('search@get', {'clientId': clientId});
                    // },
                    Countries: function (msApi) {
                        return msApi.resolve('search.countries@get');
                      }
                }
            });

        // API
        msApiProvider.register('search.data', ['app/data/search/data.json']);
        msApiProvider.register('search.countries', ['app/data/profile/countries.json']);

        // // Translation
        $translatePartialLoaderProvider.addPart('app/main/search');

    }
})();
