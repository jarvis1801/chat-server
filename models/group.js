const mongoose = require('mongoose');
 
const GroupSchema = mongoose.Schema({
    user1: { type: String, require: true },
    user2: { type: String, require: true }
});
 
module.exports = mongoose.model('Group', GroupSchema);