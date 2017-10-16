'use strict';

define(['app', 'usersApp/services/usersBreezeService',
        'usersApp/services/usersService'], function (app) {

    var injectParams = ['config', 'usersService', 'usersBreezeService'];

    var dataService = function (config, usersService, usersBreezeService) {
        return (config.useBreeze) ? usersBreezeService : usersService;
    };

    dataService.$inject = injectParams;

    app.factory('dataService',
        ['config', 'usersService', 'usersBreezeService', dataService]);

});

