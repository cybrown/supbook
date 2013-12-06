var mongoose = require('mongoose');


var UserSchma = new mongoose.Schema({
    email: String,
    name: String,
    forname: String,
    password: String
});

var User = mongoose.model('User', UserSchma);

module.exports = User;
