'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: String,
    date_created: {
        type: Number,
        default: Date.now()
    }
}, {collection: 'User'});

module.exports = mongoose.model('User', userSchema);
