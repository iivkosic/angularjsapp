(function ()
{
    'use strict';

    angular
        .module('app.profile', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider.state('app.profile', {
            url      : '/profile?id&resortId&externalProfileId',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/profile/profile.html',
                    controller : 'ProfileController as vm'
                }
            },
            resolve  : {
                Timeline    : function (msApi)
                {
                    return msApi.resolve('profile.timeline@get');
                },
                About       : function (msApi)
                {
                    return msApi.resolve('profile.about@get');
                },
                SearchData: function (msApi) {
                    return msApi.resolve('search.data@get');
                  },
                  Labels: function (msApi) {
                      return msApi.resolve('notes.labels@get');
                    },
                    LabelsNotes: function (msApi) {
                        return msApi.resolve('notes.labels_notes@get');
                      },
                    PreferencesList: function (msApi) {
                        return msApi.resolve('notes.preferences@get');
                      }
            },
            bodyClass: 'profile'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/profile');

        // Api
        msApiProvider.register('profile.timeline', ['app/data/profile/timeline.json']);
        msApiProvider.register('profile.about', ['app/data/profile/about.json']);
        // API
        msApiProvider.register('search.data', ['app/data/search/data.json']);
        msApiProvider.register('notes.labels', ['app/data/notes/labels.json']);
        msApiProvider.register('notes.labels_notes', ['app/data/notes/labels_notes.json']);
        msApiProvider.register('notes.preferences', ['app/data/notes/preferences.json']);
        // Navigation
        // msNavigationServiceProvider.saveItem('profile', {
        //     title : 'Profile',
        //     icon  : 'icon-account',
        //     state : 'app.profile',
        //     weight: 6
        // });
    }

})();
