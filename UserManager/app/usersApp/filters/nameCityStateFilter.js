'use strict';

define(['app'], function (app) {

    var nameCityStateFilter = function () {

        return function (users, filterValue) {
            if (!filterValue) return users;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < users.length; i++) {
                var cust = users[i];
                if (cust.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.city.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.state.name.toLowerCase().indexOf(filterValue) > -1) {

                    matches.push(cust);
                }
            }
            return matches;
        };
    };

    app.filter('nameCityStateFilter', nameCityStateFilter);

});