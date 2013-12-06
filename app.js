
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/supbook', function (err) {
    if (err) throw err;
});

var User = require('./models/user');
var Message = require('./models/message');


var registerUser = function (email, name, forname, password, cb) {
    User.find({
        'email': email
    }, function (err, users) {
        if (users.length === 0) {
            var user = new User({
                'email': email,
                'name': name,
                'forname': forname,
                'password': password
            });
            user.save(function (err) {
                cb(err, true);
            });
        } else {
            cb(null, false);
        }
    });
};


var login = function (email, password, cb) {
    User.find({
        'email': email,
        'password': password
    }, function (err, users) {
        if (err) throw err;
        if (users.length > 0) {
            cb(err, users[0]._id);
        } else {
            cb(err, false);
        }
    });
};

var searchUser = function(userName, cb) {
    User.find({ name: userName }, function (err, users) {
        if (err) throw err;
        if (users.length > 0) {
            cb(err, true);
        } else {
            cb(err, false);
        }
    });
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/login', function (req, res) {
    res.render('login', { title: 'Express' });
});

app.post('/login', function (req, res) {
    login(req.body.email, req.body.password, function (err, userId) {
        req.session.userId = userId;
        req.session.email = req.body.email;
        if (err) throw err;
        if (userId) {
            res.redirect('/');
        } else {
            res.send('ko');
        }
    });
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    registerUser(req.body.email, req.body.name, req.body.forname, req.body.password, function (err, result) {
        if (err) throw err;
        if (result) {
            res.redirect('/');
        } else {
            res.send('ko');
        }
    });
});

app.post('/search', function(req, res) {
    searchUser(req.body.name, function(err, result) {
        if (err) throw err;
        if (result) {
            res.send("there is the result: " + result);
        } else {
            res.send('no users found');
        }
    })
});

var addPost = function (userId, message, cb) {
    var message = new Message({
        from: userId,
        to: userId,
        message: message
    });
    message.save(cb);
};

var addPostTo = function (fromUserId, toUserId, message, cb) {
    var message = new Message({
        from: fromUserId,
        to: toUserId,
        message: message
    });
    message.save(cb);
};

app.get('/post', function (req, res) {
    res.render('post');
});

app.post('/post', function (req, res) {
    if (!req.session.userId) {
        res.send('no user');
    } else {
        addPost(req.session.userId, req.body.message, function (err, result) {
            if (err) throw err;
            if (result) {
                res.send('ok');
            } else {
                res.send('ko');
            }
        });
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
