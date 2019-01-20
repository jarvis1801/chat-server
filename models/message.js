// denpend
const moment = require('moment');
const restful = require('node-restful');
const mongoose = restful.mongoose;
const posted_at = moment();

// Schema
const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    reciever: { type: String, required: true },
    message: { type: String, required: true },
    posted_at: { type: String, default: posted_at }
});

// return models
module.exports = restful.model('message', messageSchema);