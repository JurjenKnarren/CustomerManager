var db = require('../accessDB')
  , util = require('util');

// GET

exports.user = function (req, res) {
    console.log('*** user');

    db.getUser(req.params.id, function (err, user) {
        if (err) {
            console.log('*** user err');
            res.json({
                user: user
            });
        } else {
            console.log('*** user ok');
            res.json(user);
        }
    });
};

exports.addUser = function (req, res) {
    console.log('*** addUser');
    db.getState(req.body.stateId, function (err, state) {
        if (err) {
            console.log('*** getState err');
            res.json({ 'status': false });
        } else {
            db.insertUser(req.body, state, function (err) {
                if (err) {
                    console.log('*** addUser err');
                    res.json(false);
                } else {
                    console.log('*** addUser ok');
                    res.json(req.body);
                }
            });
        }
    });
};

exports.editUser = function (req, res) {
    console.log('*** editUser');

    db.getState(req.body.stateId, function (err, state) {
        if (err) {
            console.log('*** getState err');
            res.json({ 'status': false });
        } else {
            db.editUser(req.params.id, req.body, state, function (err) {
                if (err) {
                    console.log('*** editUser err' + util.inspect(err));
                    res.json({ 'status': false });
                } else {
                    console.log('*** editUser ok');
                    res.json({ 'status': true });
                }
            });
        }
    });
};

exports.deleteUser = function (req, res) {
    console.log('*** deleteUser');

    db.deleteUser(req.params.id, function (err) {
        if (err) {
            console.log('*** deleteUser err');
            res.json({ 'status': false });
        } else {
            console.log('*** deleteUser ok');
            res.json({ 'status': true });
        }
    });
};

// GET
exports.states = function (req, res) {
    console.log('*** states');
    db.getStates(function (err, states) {
        if (err) {
            console.log('*** states err');
            res.json({
                states: states
            });
        } else {
            console.log('*** states ok');
            res.json(states);
        }
    });
};

exports.users = function (req, res) {
    console.log('*** users');
    var topVal = req.query.$top,
        skipVal = req.query.$skip,
        top = (isNaN(topVal)) ? 10 : parseInt(req.query.$top, 10),
        skip = (isNaN(skipVal)) ? 0 : parseInt(req.query.$skip, 10);

    db.getUsers(skip, top, function (err, data) {
        res.setHeader('X-InlineCount', data.count);
        if (err) {
            console.log('*** users err');
            res.json({
                users: data.users
            });
        } else {
            console.log('*** users ok');
            res.json(data.users);
        }
    });
};

exports.usersSummary = function (req, res) {
    console.log('*** usersSummary');
    var topVal = req.query.$top,
        skipVal = req.query.$skip,
        top = (isNaN(topVal)) ? 10 : parseInt(req.query.$top, 10),
        skip = (isNaN(skipVal)) ? 0 : parseInt(req.query.$skip, 10);

    db.getUsersSummary(skip, top, function (err, summary) {
        res.setHeader('X-InlineCount', summary.count);
        if (err) {
            console.log('*** usersSummary err');
            res.json({
                usersSummary: summary.usersSummary
            });
        } else {
            console.log('*** usersSummary ok');
            res.json(summary.usersSummary);
        }
    });
};

exports.checkUnique = function (req, res) {
    console.log('*** checkUnique');

    var id = req.params.id,
    	value = req.query.value,
    	property = req.query.property;

    db.checkUnique(id, property, value, function (err, opStatus) {
        if (err) {
            console.log('*** checkUnique err');
            res.json({
                'status': false
            });
        } else {
            console.log('*** checkUnique ok');
            res.json(opStatus);
        }
    });
};

exports.login = function (req, res) {
    console.log('*** login');
    var userLogin = req.body.userLogin;
    var userName = userLogin.userName;
    var password = userLogin.password;

    //Simulate login
    res.json({ status: true });
};

exports.logout = function (req, res) {
    console.log('*** logout');

    //Simulate logout
    res.json({ status: true });
};





