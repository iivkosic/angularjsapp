(function ()
{
    'use strict';

    angular
        .module('app.notes', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider.state('app.notes', {
            url    : '/notes',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/apps/notes/notes.html',
                    controller : 'NotesController as vm'
                }
            },
            resolve: {
                Notes : function (NotesService)
                {
                    return NotesService.getData();
                },
                Labels: function (LabelsService)
                {
                    return LabelsService.getData();
                },
                LabelsNotes: function (msApi) {
                    return msApi.resolve('notes.labels_notes@get');
                  },
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/notes');

        // Api
        msApiProvider.register('notes.notes', ['app/data/notes/notes.json']);
        msApiProvider.register('notes.labels', ['app/data/notes/labels.json']);
        msApiProvider.register('notes.labels_notes', ['app/data/notes/labels_notes.json']);


    }

})();
