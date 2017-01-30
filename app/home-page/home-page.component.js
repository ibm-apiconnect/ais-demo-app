'use strict';

angular
  .module('homePage')
  .component('homePage', {
    templateUrl: 'home-page/home-page.template.html',
    controller: ['$rootScope', '$scope', '$location', 'localStorageService',
      function homePageController($rootScope, $scope, $location, localStorageService) {

        /* View Vars */

        /* Controller Functions */

        function configured () {
          return (localStorageService.get("urlBase"));
        }

        /* Initialize Page */

        if (configured()) {
          $rootScope.logInOutLink = "#!/logout";
          $rootScope.logInOutText = "Log Out";
        } else {
          $location.path('/config');
        }
      }
    ]
  });