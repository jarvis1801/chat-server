// denpend
const restful = require('node-restful');
const mongoose = restful.mongoose;

// Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, min: 8 },
    password: { type: String, required: true, min: 8 },
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    usertype: { type: String, default: "user" }
});

// return models
module.exports = restful.model('user', userSchema);