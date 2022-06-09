'use strict';

const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    ip: String,
    is_active: {
        type: Boolean,
        default: true,
    },
    date_last_login: {
        type: Number,
        default: null,
    },
}, {collection: 'Device'});

module.exports = mongoose.model('Device', deviceSchema);
