'use strict';

angular
  .module('thinkServices')
  .factory("Think", ['$resource',
    function ($resource) {

      return {
        Item: function (options) {
          return $resource(
            options.urlBase + '/stock/v1/list/:id',
            {id: '@id'},
            {
              'get': {
                method:'GET',
                headers: options.headers
              },
              'query': {
                method:'GET',
                isArray:true,
                headers: options.headers
              }
            });
        },
        Order: function (options) {
          return $resource(
            options.urlBase + '/stockorders/v1/order',
            {
              'save': {
                method:'POST',
                headers: options.headers,
                transformRequest: function (data) {
                  return JSON.stringify(data);
                }
              }
            });
        }
      }
    }
  ]);