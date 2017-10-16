'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService'];

    var UsersController = function ($location, $filter, $window,
        $timeout, authService, dataService, modalService) {

        var vm = this;

        vm.users = [];
        vm.filteredUsers = [];
        vm.filteredCount = 0;
        vm.orderby = 'lastName';
        vm.reverse = false;
        vm.searchText = null;
        vm.cardAnimationClass = '.card-animation';

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            getUsersSummary();
        };

        vm.deleteUser = function (id) {
            if (!authService.user.isAuthenticated) {
                $location.path(authService.loginPath + $location.$$path);
                return;
            }

            var cust = getUserById(id);
            var custName = cust.firstName + ' ' + cust.lastName;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete User',
                headerText: 'Delete ' + custName + '?',
                bodyText: 'Are you sure you want to delete this user?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteUser(id).then(function () {
                        for (var i = 0; i < vm.users.length; i++) {
                            if (vm.users[i].id === id) {
                                vm.users.splice(i, 1);
                                break;
                            }
                        }
                        filterUsers(vm.searchText);
                    }, function (error) {
                        $window.alert('Error deleting user: ' + error.message);
                    });
                }
            });
        };

        vm.DisplayModeEnum = {
            Card: 0,
            List: 1
        };

        vm.changeDisplayMode = function (displayMode) {
            switch (displayMode) {
                case vm.DisplayModeEnum.Card:
                    vm.listDisplayModeEnabled = false;
                    break;
                case vm.DisplayModeEnum.List:
                    vm.listDisplayModeEnabled = true;
                    break;
            }
        };

        vm.navigate = function (url) {
            $location.path(url);
        };

        vm.setOrder = function (orderby) {
            if (orderby === vm.orderby) {
                vm.reverse = !vm.reverse;
            }
            vm.orderby = orderby;
        };

        vm.searchTextChanged = function () {
            filterUsers(vm.searchText);
        };

        function init() {
            //createWatches();
            getUsersSummary();
        }

        //function createWatches() {
        //    //Watch searchText value and pass it and the users to nameCityStateFilter
        //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
        //    //while also accessing the filtered count via vm.filteredCount above

        //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
        //    vm.$watch("searchText", function (filterText) {
        //        filterUsers(filterText);
        //    });
        //}

        function getUsersSummary() {
            dataService.getUsersSummary(vm.currentPage - 1, vm.pageSize)
            .then(function (data) {
                vm.totalRecords = data.totalRecords;
                vm.users = data.results;
                filterUsers(''); //Trigger initial filter

                $timeout(function () {
                    vm.cardAnimationClass = ''; //Turn off animation since it won't keep up with filtering
                }, 1000);

            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }

        function filterUsers(filterText) {
            vm.filteredUsers = $filter("nameCityStateFilter")(vm.users, filterText);
            vm.filteredCount = vm.filteredUsers.length;
        }

        function getUserById(id) {
            for (var i = 0; i < vm.users.length; i++) {
                var cust = vm.users[i];
                if (cust.id === id) {
                    return cust;
                }
            }
            return null;
        }

        init();
    };

    UsersController.$inject = injectParams;

    app.register.controller('UsersController', UsersController);

});