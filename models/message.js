// denpend
const restful = require('node-restful');
const mongoose = restful.mongoose;

// Schema
const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    // reciever: { type: String, required: true },
    message: { type: String, required: true },
    posted_at: { type: String, required: true },
    group_id: { type: String, required: true },
    group: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Group' }
});

// return models
module.exports = restful.model('message', messageSchema);