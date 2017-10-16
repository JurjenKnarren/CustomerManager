'use strict';

define(['app'], function (app) {
    
    var injectParams = ['$scope', '$routeParams', '$window', 'dataService'];

    var UserOrdersController = function ($scope, $routeParams, $window, dataService) {
        var vm = this,
            userId = ($routeParams.userId) ? parseInt($routeParams.userId) : 0;

        vm.user = {};
        vm.ordersTotal = 0.00;

        init();

        function init() {
            if (userId > 0) {
                dataService.getUser(userId)
                .then(function (user) {
                    vm.user = user;
                    $scope.$broadcast('user', user);
                }, function (error) {
                    $window.alert("Sorry, an error occurred: " + error.message);
                });
            }
        }
    };

    UserOrdersController.$inject = injectParams;

    app.register.controller('UserOrdersController', UserOrdersController);

});