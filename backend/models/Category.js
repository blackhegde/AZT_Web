const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true, unique: true },
        vi: { type: String, required: true, unique: true }
    },
    description: {
        en: { type: String, default: '' },
        vi: { type: String, default: '' }
    },
    imageUrl: { type: String },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);