(function() {
  'use strict';

  var auth = {};
  var logout = function() {
    console.log('*** LOGOUT');
    auth.loggedIn = false;
    auth.authz = null;
    window.location = auth.logoutUrl;
  };

  function setLogout() {
    var $body = angular.element(document.body);
    var $rootScope = $body.injector().get('$rootScope');
    $rootScope.$apply(function() {
      $rootScope.logout = logout;
    });
  }

  // angular mdule
  var module = angular.module('fuse');

  angular.element(document).ready(function() {

    var keycloakAuth = new Keycloak('assets/DEMO-keycloak.json');

    auth.loggedIn = false;

    keycloakAuth.init({
      onLoad: 'login-required'
    }).success(function() {
      auth.loggedIn = true;
      auth.authz = keycloakAuth;
      auth.doLogout = logout;
      module.factory('Auth', function() {
        return auth;
      });

      // setLogout();

      angular.bootstrap(document, ["fuse"]);

      // deferredBootstrapper.bootstrap({
      //   element: document.documentElement,
      //   module: 'fuse'
      //   // injectorModules: ['fiscalHubUi', 'fiscalHubUi.config'],
      //   // resolve: {
      //   //   APP_CONFIG: ['$http', 'EnvironmentConfig', function($http, EnvironmentConfig) {
      //   //     var url = EnvironmentConfig.api + "/init";
      //   //     return $http.get(url);
      //   //   }]
      //   // }
      // }).then(setLogout);

    }).error(function(error) {
      console.error(error);
      //window.location.reload();
    });

  });

  angular
    .module('fuse')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $timeout, $state) {
    // Activate loading indicator
    var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function() {
      $rootScope.loadingProgress = true;
    });

    // De-activate loading indicator
    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function() {
      $timeout(function() {
        $rootScope.loadingProgress = false;
      });
    });

    // Store state in the root scope for easy access
    $rootScope.state = $state;

    // Cleanup
    $rootScope.$on('$destroy', function() {
      stateChangeStartEvent();
      stateChangeSuccessEvent();
    });
  }
})();
