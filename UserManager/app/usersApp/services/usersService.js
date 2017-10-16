'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var usersFactory = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {};

        factory.getUsers = function (pageIndex, pageSize) {
            return getPagedResource('users', pageIndex, pageSize);
        };

        factory.getUsersSummary = function (pageIndex, pageSize) {
            return getPagedResource('usersSummary', pageIndex, pageSize);
        };

        factory.getStates = function () {
            return $http.get(serviceBase + 'states').then(
                function (results) {
                    return results.data;
                });
        };

        factory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        factory.insertUser = function (user) {
            return $http.post(serviceBase + 'postUser', user).then(function (results) {
                user.id = results.data.id;
                return results.data;
            });
        };

        factory.newUser = function () {
            return $q.when({ id: 0 });
        };

        factory.updateUser = function (user) {
            return $http.put(serviceBase + 'putUser/' + user.id, user).then(function (status) {
                return status.data;
            });
        };

        factory.deleteUser = function (id) {
            return $http.delete(serviceBase + 'deleteUser/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getUser = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'userById/' + id).then(function (results) {
                extendUsers([results.data]);
                return results.data;
            });
        };

        function extendUsers(users) {
            var custsLen = users.length;
            //Iterate through users
            for (var i = 0; i < custsLen; i++) {
                var cust = users[i];
                if (!cust.orders) continue;

                var ordersLen = cust.orders.length;
                for (var j = 0; j < ordersLen; j++) {
                    var order = cust.orders[j];
                    order.orderTotal = order.quantity * order.price;
                }
                cust.ordersTotal = ordersTotal(cust);
            }
        }

        function getPagedResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                var custs = response.data;
                extendUsers(custs);
                return {
                    totalRecords: parseInt(response.headers('X-InlineCount')),
                    results: custs
                };
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
            return uri;
        }

        // is this still used???
        function orderTotal(order) {
            return order.quantity * order.price;
        };

        function ordersTotal(user) {
            var total = 0;
            var orders = user.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal;
            }
            return total;
        };

        return factory;
    };

    usersFactory.$inject = injectParams;

    app.factory('usersService', usersFactory);

});