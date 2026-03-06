
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
    },
    visitHistory: [
        {
            createdAt: {
                type: Date,
                default: Date.now,
            },
            ip: String,
            country: String,
            city: String,
            browser: String,
            os: String,
        }
    ],
}, { timestamps: true });

const URL = mongoose.model('url', urlSchema);

module.exports = URL;