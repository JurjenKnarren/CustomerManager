require.config({
    baseUrl: 'app',
    urlArgs: 'v=1.0'
});

require(
    [
        'usersApp/animations/listAnimations',
        'app',
        'usersApp/directives/wcUnique',
        'usersApp/services/routeResolver',
        'usersApp/services/config',
        'usersApp/services/usersBreezeService',
        'usersApp/services/authService',
        'usersApp/services/usersService',
        'usersApp/services/dataService',
        'usersApp/services/modalService',
        'usersApp/services/httpInterceptors',
        'usersApp/filters/nameCityStateFilter',
        'usersApp/filters/nameProductFilter',
        'usersApp/controllers/navbarController',
        'usersApp/controllers/orders/orderChildController',
    ],
    function () {
        angular.bootstrap(document, ['usersApp']);
    });
