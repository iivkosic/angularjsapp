(function ()
{
    'use strict';

    angular
        .module('app.dashboard',
            [
                // 3rd Party Dependencies
                'nvd3'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        // State
        $stateProvider.state('app.dashboard', {
            url      : '/dashboard',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/dashboard/dashboard.html',
                    controller : 'DashboardController as vm'
                }
            },
            resolve  : {

            },
            bodyClass: 'dashboard'
        });

        // Api

    }

})();
