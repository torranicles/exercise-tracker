const mongoose = require('mongoose');

const exerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: Date
});

let Exercise = mongoose.model('Exercise', exerSchema);

module.exports = Exercise;