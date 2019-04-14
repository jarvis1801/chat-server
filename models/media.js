

const mongoose = require('mongoose');
 
const MediaSchema = mongoose.Schema({
    url: { type: String, required: true },
    type: { type: String, required: true },
    username: { type: String, required: true }
});
 
module.exports = mongoose.model('Media', MediaSchema);