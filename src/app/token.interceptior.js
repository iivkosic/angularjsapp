(function ()
{
    'use strict';

    angular
        .module('app.token', [])
        .factory('authInterceptor', authInterceptor);

    /** @ngInject */
    function authInterceptor($q, $log, $rootScope, $window, Auth, $location) {
      //KEYCLOAK Verzija
      return {
        // optional method
        'request': function(config) {
          var deferred = $q.defer();
          if (Auth.authz.token) {
            Auth.authz.updateToken(5).success(function() {
              config.headers = config.headers || {};
              config.headers.Authorization = 'Bearer ' + Auth.authz.token;
              deferred.resolve(config);
            }).error(function() {
              deferred.reject('Failed to refresh token');
            });
          }
          return deferred.promise;
        },
        // optional method
        'requestError': function(rejection) {
          return $q.reject(rejection);
        },

        'responseError': function(rejection) {
          console.log("upao u error");
          // $location.path('/error-404');

          if (rejection.status === 401) {

            $log.error('session timeout?');
             $rootScope.logout();
          } else if (rejection.status === 403) {

            $log.error('Forbidden');
            $window.alert("Forbidden");
          } else if (rejection.status === 404) {

            $log.error('Not found: ' + rejection.status);
            // alert("Not found");
          } else if (rejection.status) {
            $log.error(rejection.data);
            // $log.error("Error: " + JSON.stringify(rejection.data));
          }
          // $location.path('/error-404');
           window.location.replace("/#!/error-404");
          //$window.location.href = "/error-404";
          //$location.path('/error-404');
          // return rejection;
          return $q.reject(rejection);
        }

      //X-Bearer VERZIJA
      // return {
      //   // optional method
      //   'request': function(config) {
      //     var deferred = $q.defer();
      //     config.headers = config.headers || {};
      //     config.headers.Authorization = 'X-Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzZjYyMzk1ZS1lNzkxLTQ5YTctODBkYi00ODQ2ZjllMGE2MjgiLCJpc3MiOiJ3d3cuaG90bWFyay1jcm0uY29tIiwiaWF0IjoxNDU2OTQ0MDM3MDExLCJzdWIiOiJERU1PIiwiand0dHlwZSI6ImdlbmVyYWwifQ.3BEJxraCj8KnxpTpqMbF6nkpvbA6h5vQnmAFLo2nkJplxo7IFXt2Gtq3Yll_8U6k8FxWnpVyhCE4UiM2C-KyAA';
      //     deferred.resolve(config);
      //     return deferred.promise;
      //   },
      //
      //   // optional method
      //   'requestError': function(rejection) {
      //     return $q.reject(rejection);
      //   },
      //
      //   'responseError': function(rejection) {
      //     if (rejection.status === 401) {
      //       $log.error('session timeout?');
      //       $rootScope.logout();
      //     } else if (rejection.status === 403) {
      //       $log.error('Forbidden');
      //       $window.alert("Forbidden");
      //     } else if (rejection.status === 404) {
      //       $log.error('Not found: ' + rejection.status);
      //       // alert("Not found");
      //     } else if (rejection.status) {
      //       $log.error("Error: " + JSON.stringify(rejection.data));
      //     }
      //     return $q.reject(rejection);
      //   }

      // };

    }
  }

})();
