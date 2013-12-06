var mongoose = require('mongoose');


var MessageSchema = new mongoose.Schema({
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    message: String,
    private: Boolean,
    date: {type: Date, default: Date.now}
});

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
