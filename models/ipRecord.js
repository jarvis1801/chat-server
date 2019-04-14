const mongoose = require('mongoose');
 
const IpRecordSchema = mongoose.Schema({
    ip: { type: String, required: true },
    datetime: { type: String, require: true }
});
 
module.exports = mongoose.model('IpRecord', IpRecordSchema);