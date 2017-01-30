'use strict';

angular
  .module('appConfig')
  .component('appConfig', {
    templateUrl: 'app-config/app-config.template.html',
    controller: ['$rootScope', '$scope', '$location', 'localStorageService',
      function appConfigController($rootScope, $scope, $location, localStorageService) {

        console.log("initializing");

        localStorageService.set("urlBase", (localStorageService.get("urlBase") ? localStorageService.get("urlBase") : null));

        console.log("init urlBase value: " + localStorageService.get("urlBase"));
  
        /* Pre-Set Form Values */
        $scope.config = {
          host: "https://api.us.apiconnect.ibmcloud.com",
          organization: "< YOUR ORGANIZATION NAME >",
          catalog: "sb"
        };
  
        $scope.setConfig = function (config) {

          console.log("setting config");

          localStorageService.set("urlBase", config.host + '/' + config.organization + '/' + config.catalog);

          console.log("new urlBase value: " + localStorageService.get("urlBase"));

          $location.path('/');
        };

        $rootScope.logInOutLink = "";
        $rootScope.logInOutText = "";
      }
    ]
  });