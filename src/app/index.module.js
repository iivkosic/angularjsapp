(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Common 3rd Party Dependencies
            'googlechart',
            // Core
            'app.core',

            'app.notes',

            'app.pages.error-404',

            // Quick panel
            'app.quick-panel',

            // Directives
            'app.directives',

            // Privremeni X-Beared Interceptor
            'app.token',

            // Search
            'app.dashboard',

            // Search
            'app.search',

            // Profile
            'app.profile',

            'ui.codemirror',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar'
        ]);
})();
