'use strict';

define(['app'], function (app) {

    var nameProductFilter = function () {

        function matchesProduct(user, filterValue) {
            if (user.orders) {
                for (var i = 0; i < user.orders.length; i++) {
                    if (user.orders[i].product.toLowerCase().indexOf(filterValue) > -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        return function (users, filterValue) {
            if (!filterValue || !users) return users;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < users.length; i++) {
                var cust = users[i];
                if (cust.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                    matchesProduct(cust, filterValue)) {

                    matches.push(cust);
                }
            }
            return matches;
        };
    };

    app.filter('nameProductFilter', nameProductFilter);

});