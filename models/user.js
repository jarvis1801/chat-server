// denpend
const restful = require('node-restful');
const mongoose = restful.mongoose;

// Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, min: 8 },
    password: { type: String, required: true, min: 8 },
    // lastname: { type: String, required: true },
    // firstname: { type: String, required: true },
    userType: { type: String, default: "user" },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    avatar: { type: Object }
});

// return models
module.exports = restful.model('user', userSchema);