'use strict';

define(['app'], function (app) {

    var injectParams = ['$filter', '$window', 'dataService'];

    var OrdersController = function ($filter, $window, dataService) {
        var vm = this;

        vm.users = [];
        vm.filteredUsers;
        vm.filteredCount;

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        init();

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            getUsers();
        };

        vm.searchTextChanged = function () {
            filterUsersProducts(vm.searchText);
        };

        function init() {
            //createWatches();
            getUsers();
        }

        //function createWatches() {
        //    //Watch searchText value and pass it and the users to nameCityStateFilter
        //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
        //    //while also accessing the filtered count via vm.filteredCount above

        //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
        //    $scope.$watch("searchText", function (filterText) {
        //        filterUsersProducts(filterText);
        //    });
        //}

        function filterUsersProducts(filterText) {
            vm.filteredUsers = $filter("nameProductFilter")(vm.users, filterText);
            vm.filteredCount = vm.filteredUsers.length;
        }

        function getUsers() {
            dataService.getUsers(vm.currentPage - 1, vm.pageSize)
                .then(function (data) {
                    vm.totalRecords = data.totalRecords;
                    vm.users = data.results;
                    filterUsersProducts('');
                }, function (error) {
                    $window.alert(error.message);
                });
        }
    };

    OrdersController.$inject = injectParams;

    app.register.controller('OrdersController', OrdersController);

});