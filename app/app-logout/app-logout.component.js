'use strict';

angular
  .module('appLogout')
  .component('appLogout', {
    templateUrl: 'app-logout/app-logout.template.html',
    controller: ['$location', '$scope', 'localStorageService',
      function appLogoutController($location, $scope, localStorageService) {

        console.log("clearing config");

        localStorageService.set("urlBase", null);

        console.log("new urlBase value: " + localStorageService.get("urlBase"));

        $location.path('/config');
  
      }
    ]
  });