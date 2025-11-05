const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        en: { type: String, required: true },
        vi: { type: String, required: true }
    },
    description: { 
        en: { type: String, required: true },
        vi: { type: String, required: true }
    },
    short_description: { 
        en: { type: String, required: true },
        vi: { type: String, required: true }
    },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    category: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);