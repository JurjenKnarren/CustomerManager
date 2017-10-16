// Module dependencies
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , User = require('./models/user')
  , State = require('./models/state')
  , util = require('util');

// connect to database
module.exports = {
    // Define class variable
    myEventID: null,

    // initialize DB
    startup: function (dbToUse) {
        mongoose.connect(dbToUse);
        // Check connection to mongoDB
        mongoose.connection.on('open', function () {
            console.log('We have connected to mongodb');
        });

    },

    // disconnect from database
    closeDB: function () {
        mongoose.disconnect();
    },

    // get all the users
    getUsers: function (skip, top, callback) {
        console.log('*** accessDB.getUsers');
        User.count(function(err, custsCount) {
            var count = custsCount;
            console.log('Users count: ' + count);

            User.find({}, { '_id': 0, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'orders': 1, 'orderCount': 1, 'gender': 1, 'id': 1 })
                /*
                //This stopped working (not sure if it's a mongo or mongoose change) so doing 2 queries now
                function (err, users) {
                    console.log('Users count: ' + users.length);
                    count = users.length;
                })*/
            .skip(skip)
            .limit(top)
            .exec(function (err, users) {
                callback(null, {
                    count: count,
                    users: users
                });
            });

        });
    },

    // get the user summary
    getUsersSummary: function (skip, top, callback) {
        console.log('*** accessDB.getUsersSummary');
        User.count(function(err, custsCount) {
            var count = custsCount;
            console.log('Users count: ' + count);

            User.find({}, { '_id': 0, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'orderCount': 1, 'gender': 1, 'id': 1 })
            /*
            //This stopped working (not sure if it's a mongo or mongoose change) so doing 2 queries now
            function (err, usersSummary) {
                console.log('Users Summary count: ' + usersSummary.length);
                count = usersSummary.length;
            })
            */
            .skip(skip)
            .limit(top)
            .exec(function (err, usersSummary) {
                callback(null, {
                    count: count,
                    usersSummary: usersSummary
                });
            });

        });
    },

    // get a  user
    getUser: function (id, callback) {
        console.log('*** accessDB.getUser');
        User.find({ 'id': id }, {}, function (err, user) {
            callback(null, user[0]);
        });
    },

    // insert a  user
    insertUser: function (req_body, state, callback) {
        console.log('*** accessDB.insertUser');

        var user = new User();
        var s = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name }

        user.firstName = req_body.firstName;
        user.lastName = req_body.lastName;
        user.email = req_body.email;
        user.address = req_body.address;
        user.city = req_body.city;
        user.state = s;
        user.stateId = state[0].id;
        user.zip = req_body.zip;
        user.gender = req_body.gender;
        user.id = 1; // The id is calculated by the Mongoose pre 'save'.

        user.save(function (err, user) {
            if (err) { console.log('*** new user save err: ' + err); return callback(err); }

            callback(null, user.id);
        });
    },

    editUser: function (id, req_body, state, callback) {
        console.log('*** accessDB.editUser');

        var s = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name }

        User.findOne({ 'id': id }, { '_id': 1, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'gender': 1, 'id': 1 }, function (err, user) {
            if (err) { return callback(err); }

            user.firstName = req_body.firstName || user.firstName;
            user.lastName = req_body.lastName || user.lastName;
            user.email = req_body.email || user.email;
            user.address = req_body.address || user.address;
            user.city = req_body.city || user.city;
            user.state = s;
            user.stateId = s.id;
            user.zip = req_body.zip || user.zip;
            user.gender = req_body.gender || user.gender;


            user.save(function (err) {
                if (err) { console.log('*** accessDB.editUser err: ' + err); return callback(err); }

                callback(null);
            });

        });
    },

    // delete a user
    deleteUser: function (id, callback) {
        console.log('*** accessDB.deleteUser');
        User.remove({ 'id': id }, function (err, user) {
            callback(null);
        });
    },

    // get a  user's email
    checkUnique: function (id, property, value, callback) {
        console.log('*** accessDB.checkUnique');
        console.log(id + ' ' + value)
        switch (property) {
            case 'email':
                User.findOne({ 'email': value, 'id': { $ne: id} })
                        .select('email')
                        .exec(function (err, user) {
                            console.log(user)
                            var status = (user) ? false : true;
                            callback(null, {status: status});
                        });
                break;
        }

    },

    // get all the states
    getStates: function (callback) {
        console.log('*** accessDB.getStates');
        State.find({}, {}, { sort: { name: 1 } }, function (err, states) {
            callback(null, states);
        });
    },

    // get a state
    getState: function (stateId, callback) {
        console.log('*** accessDB.getState');
        State.find({ 'id': stateId }, {}, function (err, state) {
            callback(null, state);
        });
    }


}
