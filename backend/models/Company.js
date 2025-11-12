const mongoose = require('mongoose');

const companiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Companies', companiesSchema);