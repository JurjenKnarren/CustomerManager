'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope'];

    var OrderChildController = function ($scope) {
        var vm = this;

        vm.orderby = 'product';
        vm.reverse = false;
        vm.ordersTotal = 0.00;
        vm.user;

        init();

        vm.setOrder = function (orderby) {
            if (orderby === vm.orderby) {
                vm.reverse = !vm.reverse;
            }
            vm.orderby = orderby;
        };

        function init() {
            if ($scope.user) {
                vm.user = $scope.user;
                updateTotal($scope.user);
            }
            else {
                $scope.$on('user', function (event, user) {
                    vm.user = user;
                    updateTotal(user);
                });
            }
        }

        function updateTotal(user) {
            var total = 0.00;
            for (var i = 0; i < user.orders.length; i++) {
                var order = user.orders[i];
                total += order.orderTotal;
            }
            vm.ordersTotal = total;
        }
    };

    OrderChildController.$inject = injectParams;

    app.controller('OrderChildController', OrderChildController);
});