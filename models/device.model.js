'use strict';

const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    is_active: Boolean,
    date_last_login: {
        type: Number,
        default: null,
    },
}, {collection: 'Device'});

module.exports = mongoose.model('Device', deviceSchema);
