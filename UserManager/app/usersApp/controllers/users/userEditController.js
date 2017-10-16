'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams',
                        '$timeout', 'config', 'dataService', 'modalService'];

    var UserEditController = function ($scope, $location, $routeParams,
                                           $timeout, config, dataService, modalService) {

        var vm = this,
            userId = ($routeParams.userId) ? parseInt($routeParams.userId) : 0,
            timer,
            onRouteChangeOff;

        vm.user = {};
        vm.states = [];
        vm.title = (userId > 0) ? 'Edit' : 'Add';
        vm.buttonText = (userId > 0) ? 'Update' : 'Add';
        vm.updateStatus = false;
        vm.errorMessage = '';

        vm.isStateSelected = function (userStateId, stateId) {
            return userStateId === stateId;
        };

        vm.saveUser = function () {
            if ($scope.editForm.$valid) {
                if (!vm.user.id) {
                    dataService.insertUser(vm.user).then(processSuccess, processError);
                }
                else {
                    dataService.updateUser(vm.user).then(processSuccess, processError);
                }
            }
        };

        vm.deleteUser = function () {
            var custName = vm.user.firstName + ' ' + vm.user.lastName;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete User',
                headerText: 'Delete ' + custName + '?',
                bodyText: 'Are you sure you want to delete this user?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteUser(vm.user.id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/users');
                    }, processError);
                }
            });
        };

        function init() {

            getStates().then(function () {
                if (userId > 0) {
                    dataService.getUser(userId).then(function (user) {
                        vm.user = user;
                    }, processError);
                } else {
                    dataService.newUser().then(function (user) {
                        vm.user = user;
                    });
                }
            });


            //Make sure they're warned if they made a change but didn't save it
            //Call to $on returns a "deregistration" function that can be called to
            //remove the listener (see routeChange() for an example of using it)
            onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
        }

        init();

        function routeChange(event, newUrl, oldUrl) {
            //Navigate to newUrl if the form isn't dirty
            if (!vm.editForm || !vm.editForm.$dirty) return;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ignore Changes',
                headerText: 'Unsaved Changes',
                bodyText: 'You have unsaved changes. Leave the page?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    onRouteChangeOff(); //Stop listening for location changes
                    $location.path($location.url(newUrl).hash()); //Go to page they're interested in
                }
            });

            //prevent navigation by default since we'll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        function getStates() {
            return dataService.getStates().then(function (states) {
                vm.states = states;
            }, processError);
        }

        function processSuccess() {
            $scope.editForm.$dirty = false;
            vm.updateStatus = true;
            vm.title = 'Edit';
            vm.buttonText = 'Update';
            startTimer();
        }

        function processError(error) {
            vm.errorMessage = error.message;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                vm.errorMessage = '';
                vm.updateStatus = false;
            }, 3000);
        }
    };

    UserEditController.$inject = injectParams;

    app.register.controller('UserEditController', UserEditController);

});