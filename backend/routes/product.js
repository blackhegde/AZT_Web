const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

// Get all products với language support
router.get('/', async (req, res) => {
    try {
        const { lang = 'en' } = req.query; // Default to English
        
        const products = await Product.find().select({
            price: 1,
            images: 1,
            category: 1,
            status: 1,
            tags: 1,
            createdAt: 1,
            [`name.${lang}`]: 1,
            [`description.${lang}`]: 1,
            [`short_description.${lang}`]: 1,
        });
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get product by ID với language support
router.get('/:id', getProduct, (req, res) => {
    const { lang = 'en' } = req.query;
    
    // Format response based on language
    const formattedProduct = {
        _id: res.product._id,
        name: res.product.name[lang] || res.product.name.en,
        description: res.product.description[lang] || res.product.description.en,
        short_description: res.product.short_description[lang] || res.product.short_description.en,
        price: res.product.price,
        images: res.product.images,
        category: res.product.category,
        status: res.product.status,
        tags: res.product.tags,
        createdAt: res.product.createdAt
    };
    
    res.json(formattedProduct);
});

// Middleware to get product by ID
async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.product = product;
    next();
}

// Delete a product
router.delete('/:id', auth, adminAuth, getProduct, async (req, res) => {
    try {
        await res.product.remove();
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a product (CHỈ NHẬN JSON, KHÔNG UPLOAD ẢNH)
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.name || !req.body.name.en || !req.body.name.vi) {
            return res.status(400).json({ 
                message: 'Product name in both English and Vietnamese is required' 
            });
        }

        const product = new Product({
            name: {
                en: req.body.name.en,
                vi: req.body.name.vi
            },
            description: {
                en: req.body.description?.en || '',
                vi: req.body.description?.vi || ''
            },
            short_description: {
                en: req.body.short_description?.en || '',
                vi: req.body.short_description?.vi || ''
            },
            price: req.body.price,
            images: req.body.images || [], // Nhận URLs từ frontend
            category: req.body.category,
            status: req.body.status || 'active',
            tags: req.body.tags || []
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a product (CHỈ NHẬN JSON, KHÔNG UPLOAD ẢNH)
router.patch('/:id', auth, adminAuth, getProduct, async (req, res) => {
    try {
        console.log('=== UPDATE PRODUCT DEBUG ===');
        console.log('Product ID:', req.params.id);
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
        console.log('Current Product:', JSON.stringify(res.product, null, 2));
        
        // Update name (song ngữ)
        if (req.body.name != null) {
            console.log('Updating name...');
            console.log('Current product.name:', res.product.name);
            console.log('New name data:', req.body.name);
            
            if (req.body.name.en != null) {
                console.log('Setting name.en to:', req.body.name.en);
                res.product.name.en = req.body.name.en; // LỖI Ở ĐÂY
            }
            if (req.body.name.vi != null) {
                res.product.name.vi = req.body.name.vi;
            }
        }


        // Update description (song ngữ)
        if (req.body.description != null) {
            if (req.body.description.en != null) {
                res.product.description.en = req.body.description.en;
            }
            if (req.body.description.vi != null) {
                res.product.description.vi = req.body.description.vi;
            }
        }

        // Update short_description (song ngữ)
        if (req.body.short_description != null) {
            if (req.body.short_description.en != null) {
                res.product.short_description.en = req.body.short_description.en;
            }
            if (req.body.short_description.vi != null) {
                res.product.short_description.vi = req.body.short_description.vi;
            }
        }

        // Update các field không đổi theo ngôn ngữ
        if (req.body.price != null) {
            res.product.price = req.body.price;
        }
        
        // Update images từ URLs (KHÔNG xử lý upload ở đây)
        if (req.body.images != null) {
            res.product.images = req.body.images;
        }
        
        if (req.body.category != null) {
            res.product.category = req.body.category;
        }
        if (req.body.status != null) {
            res.product.status = req.body.status;
        }
        if (req.body.tags != null) {
            res.product.tags = req.body.tags;
        }

        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Upload images for a specific product
router.post('/:id/upload-images', auth, adminAuth, uploadMultiple, getProduct, async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Tạo URLs cho các ảnh mới
        const newImageUrls = req.files.map(file => `/uploads/${file.filename}`);
        
        // Thêm ảnh mới vào product
        res.product.images = [...res.product.images, ...newImageUrls];
        
        const updatedProduct = await res.product.save();
        
        res.json({
            message: 'Images uploaded successfully',
            images: newImageUrls,
            product: updatedProduct
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove specific image from product
router.delete('/:id/images/:imageIndex', auth, adminAuth, getProduct, async (req, res) => {
    try {
        const imageIndex = parseInt(req.params.imageIndex);
        
        if (imageIndex < 0 || imageIndex >= res.product.images.length) {
            return res.status(400).json({ message: 'Invalid image index' });
        }
        
        // Xóa ảnh khỏi mảng
        res.product.images.splice(imageIndex, 1);
        
        const updatedProduct = await res.product.save();
        res.json({
            message: 'Image removed successfully',
            product: updatedProduct
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search products với language support
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const { lang = 'en' } = req.query;

        const products = await Product.find({
            $or: [
                { [`name.${lang}`]: { $regex: query, $options: 'i' } },
                { [`description.${lang}`]: { $regex: query, $options: 'i' } },
                { [`short_description.${lang}`]: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ],
            status: 'active'
        }).select({
            price: 1,
            images: 1,
            category: 1,
            [`name.${lang}`]: 1,
            [`short_description.${lang}`]: 1
        }).limit(10);

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;