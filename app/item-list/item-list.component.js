'use strict';

angular.
module('itemList').
component('itemList', {
  templateUrl: 'item-list/item-list.template.html',
  controller: ['$rootScope', '$scope', '$location', '$http', 'localStorageService', 'usSpinnerService', 'Think',
    function ItemListController($rootScope, $scope, $location, $http, localStorageService, usSpinnerService, Think) {

      /* View Vars */
      
      $scope.items = [];

      /* Controller Functions */

      function configured () {
        return (localStorageService.get("urlBase"));
      }

      function formatItemData (data) {
        var formattedData = [];
        var tracker = [];

        for (var i = 0; i < data.length; i++) {
            console.log("tracking stockID: " + data[i].StockID);
            console.log("tracker indexOf " + data[i].StockID + ": " + tracker.indexOf(data[i].StockID));
            if (tracker.indexOf(data[i].StockID) === -1) {

              // Add this object to the tracker to avoid duplicates
              tracker.push(data[i].StockID);

              // Trim the whitespace from the object elements
              data[i].Description = data[i].Description.trim();
              data[i].Price = data[i].Price.trim();
              data[i].StoreLocation = data[i].StoreLocation.trim();
              data[i].img = "/images/items/" + data[i].Description.toLowerCase().replace(" ", "-") + ".jpg";

              // Push the formatted data to the new array
              formattedData.push(data[i]);
            }
        }

        return formattedData;
      }

      function loadItems() {

        var options = {
            urlBase: localStorageService.get("urlBase")
        };

        Think
          .Item(options)
          .query()
          .$promise
          .then(function (items) {
            $scope.items = formatItemData(items);
            usSpinnerService.stop('itemsSpinner');
          });

      }

      $scope.goToItem = function(itemId) {
        $location.path('/items/' + itemId);
      };

      /* Initialize Page */

      if (configured()) {
          loadItems();
      } else {
          $location.path('/config');
      }

    }
  ]
});