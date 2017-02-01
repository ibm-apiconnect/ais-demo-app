'use strict';

angular
  .module('itemDetail')
  .component('itemDetail', {
    templateUrl: 'item-detail/item-detail.template.html',
    controller: ['$rootScope', '$scope', '$location', '$routeParams', 'localStorageService', 'usSpinnerService', 'Think',
      function ItemDetailController($rootScope, $scope, $location, $routeParams, localStorageService, usSpinnerService, Think) {

        /* View Vars */

        $scope.item = {};     // loaded from the getItem function

        /* Controller Functions */

        function configured () {
          return (localStorageService.get("urlBase"));
        }

        function startSpin (hidden) {
          console.log("starting spinner");
          $scope.hideContainer = hidden;
          usSpinnerService.spin('detailSpinner');
        }

        function stopSpin () {
          console.log("stopping spinner");
          $scope.hideContainer = false;
          usSpinnerService.stop('detailSpinner');
        }

        function formatItemInfo (data, itemId) {
          var formattedData = {};

          for (var i = 0; i < data.length; i++) {
              if (data[i].StockID === itemId) {
                  data[i].Description = data[i].Description.trim();
                  data[i].Price = data[i].Price.trim();
                  data[i].img = "/images/items/" + data[i].Description.toLowerCase().replace(" ", "-") + ".jpg";
                  formattedData = data[i];
                  break;
              }
          }

          return formattedData;
        }

        function formatItemStockInfo (data) {
          var formattedItemStockData = [];

          for (var i = 0; i < data.length; i++) {
              var obj = {
                  StoreLocation: data[i].StoreLocation.trim(),
                  SOH: data[i].SOH.trim()
              };

              formattedItemStockData.push(obj);
          }

          console.log("formattedItemStockData = " + JSON.stringify(formattedItemStockData));
          return formattedItemStockData;
        }

        function getItemInfo () {
          var itemId = $routeParams.itemId;

          var options = {
              urlBase: localStorageService.get("urlBase")
          };

          Think
            .Item(options)
            .query()
            .$promise
            .then(function(items) {
              $scope.item = formatItemInfo(items, itemId);
              usSpinnerService.stop('detailSpinner');
            });
        }

        function getItemStock () {
          var itemId = $routeParams.itemId;

          var options = {
              urlBase: localStorageService.get("urlBase")
          };

          Think
              .Item(options)
              .query({
                  id: itemId
              })
              .$promise
              .then(function(itemStock) {
                  $scope.itemStock = formatItemStockInfo(itemStock);
                  usSpinnerService.stop('detailSpinner');
              });
        }

        $scope.placeOrder = function(newOrder, StockID, Location) {

          if (typeof newOrder !== "undefined") {
              startSpin(false);

              console.log("Placing new order for " + newOrder.quantity + " of " + StockID + " at location " + Location);

              var options = {
                  urlBase: localStorageService.get("urlBase"),
                  headers: {
                      'Content-Type': "application/json"
                  }
              };

              var reqBody = {
                  StockID: StockID,
                  StoreLocation: Location,
                  SOH: newOrder.quantity
              };

              Think
                  .Order(options)
                  .save(reqBody)
                  .$promise
                  .then(function (orderRsp) {
                      $scope.orderConfirmation = orderRsp;
                      console.log("refreshing stock");
                      getItemStock();
                  })
          } else {
              alert("Please select a quantity.");
          }
        };

        $scope.closeOrderConfirmation = function() {
            $scope.orderConfirmation = "undefined";
        };

        $scope.finCalc = function(amount) {

            $scope.financingResult = "calculating";

            var duration = 24;
            var rate = 3.9;

            var P = amount;
            var N = duration;
            var J = rate / 100;
            J /= 12;
            var K = 1 / (Math.pow(1 + J, N));
            var quote = P * (J / (1 - K));
            $scope.financingResult = Math.round(quote * 100) / 100;
        };

        /* Initialize Page */

        if (configured()) {
            getItemInfo();
            getItemStock();
        } else {
            $location.path('/config');
        }


      }
    ]
  });