const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: [true, "Username already taken."],
        trim: true,
        match: [/^[a-zA-Z0-9äöüÄÖÜ]*$/, "Username must not include special characters."],
        unique: true,
        minLength: [6, "Username must be at least 6 characters."]
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password must be at least 6 characters."]
    }
});

let User = mongoose.model('User', userSchema);

module.exports = User;