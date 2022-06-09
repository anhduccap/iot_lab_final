'use strict';

const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    },
    type: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: -1
    },
    date_created: {
        type: Number,
        default: Date.now()
    }
}, {collection: 'Sensor'});

module.exports = mongoose.model('Sensor', sensorSchema);
