'use strict';

define(['app'], function (app) {

    var injectParams = ['breeze', '$q', '$window'];

    var usersBreezeService = function (breeze, $q, $window) {

        var factory = {};
        var EntityQuery = breeze.EntityQuery;

        // configure to use the model library for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        // configure to use camelCase
        breeze.NamingConvention.camelCase.setAsDefault();
        // create entity Manager
        var serviceName = 'breeze/breezedataservice';
        var entityManager = new breeze.EntityManager(serviceName);

        factory.getUsers = function (pageIndex, pageSize) {
            return getPagedResource('Users', 'orders', pageIndex, pageSize);
        };

        factory.getUsersSummary = function (pageIndex, pageSize) {
            return getPagedResource('UsersSummary', '', pageIndex, pageSize);
        };

        factory.getStates = function () {
            return getAll('States');
        };

        factory.getUser = function (id) {
            var query = EntityQuery
                .from('Users')
                .where('id', '==', id)
                .expand('Orders, State');
            return executeQuery(query, true);
        };

        factory.checkUniqueValue = function (id, property, value) {
            var propertyPredicate = new breeze.Predicate(property, "==", value);
            var predicate = (id) ? propertyPredicate.and(new breeze.Predicate("id", "!=", id)) : propertyPredicate;

            var query = EntityQuery.from('Users').where(predicate).take(0).inlineCount();

            return query.using(entityManager).execute().then(function (data) {
                return (data && data.inlineCount == 0) ? true : false;
            });
        };

        factory.insertUser = function (user) {
            return entityManager.saveChanges();
        };

        factory.newUser = function () {
            return getMetadata().then(function () {
                return entityManager.createEntity('User', { firstName: '', lastName: '' });
            });
        };

        factory.deleteUser = function (id) {
            if (!id) {
                $window.alert('ID was null - cannot delete');
                return null;
            }
            var user = entityManager.getEntityByKey('User', id);

            /*  When the user is deleted the userID is set to 0 for each order
                since no parent exists
                Detach orders since the user is being deleted and server
                is set to cascade deletes
            */
            if (user) {
                var orders = user.orders.slice(); //Create a copy of the live list
                orders.forEach(function (order) {
                    entityManager.detachEntity(order);
                });
                user.entityAspect.setDeleted();
            }
            else {
                //Really a UserSummary so we're going to add a new User 
                //and mark it as deleted. That allows us to save some code and avoid having
                //a separate method to deal with the UserSummary projection
                user = entityManager.createEntity('User', { id: id, gender: 'Male' }, breeze.EntityState.Deleted);
            }

            return entityManager.saveChanges();
        };

        factory.updateUser = function (user) {
            return entityManager.saveChanges();
        };

        function executeQuery(query, takeFirst) {
            return query.using(entityManager).execute().then(querySuccess, queryError);

            function querySuccess(data, status, headers) {
                return takeFirst ? data.results[0] : data.results;
            }

            function queryError(error) {
                $window.alert(error.message);
            }
        }

        function getAll(entityName, expand) {
            var query = EntityQuery.from(entityName);
            if (expand) {
                query = query.expand(expand);
            }
            return executeQuery(query);
        }

        function getMetadata() {
            var store = entityManager.metadataStore;
            if (store.hasMetadataFor(serviceName)) { //Have metadata
                return $q.when(true);
            }
            else { //Get metadata
                return store.fetchMetadata(serviceName);
            }
        }

        function getPagedResource(entityName, expand, pageIndex, pageSize) {
            var query = EntityQuery
            .from(entityName)
            .skip(pageIndex * pageSize)
            .take(pageSize)
            .inlineCount(true);

            if (expand && expand != '') {
                query = query.expand(expand);
            }

            //Not calling the re-useable executeQuery() function here since we need to get to more details
            //and return a custom object
            return query.using(entityManager).execute().then(function (data) {
                return {
                    totalRecords: parseInt(data.inlineCount),
                    results: data.results
                };
            }, function (error) {
                $window.alert('Error ' + error.message);
            });
        }

        var OrderCtor = function () {

        };

        function orderInit(order) {
            order.orderTotal = order.quantity * order.price;
        }

        var UserCtor = function () {

        };

        function userInit(user) {
            user.ordersTotal = ordersTotal(user);
        }

        function ordersTotal(user) {
            var total = 0;
            var orders = user.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal;
            }
            return total;
        };

        entityManager.metadataStore.registerEntityTypeCtor('Order', OrderCtor, orderInit);
        entityManager.metadataStore.registerEntityTypeCtor('User', UserCtor, userInit);

        return factory;
    };

    usersBreezeService.$inject = injectParams;

    app.factory('usersBreezeService', usersBreezeService);

});