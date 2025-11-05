const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, adminAuth } = require('../middleware/auth');

// Get all categories với language support
router.get('/', async (req, res) => {
    try {
        const { lang = 'en' } = req.query;
        
        const categories = await Category.find().select({
            imageUrl: 1,
            status: 1,
            createdAt: 1,
            [`name.${lang}`]: 1,
            [`description.${lang}`]: 1
        });
        
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create category
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.name || !req.body.name.en || !req.body.name.vi) {
            return res.status(400).json({ 
                message: 'Category name in both English and Vietnamese is required' 
            });
        }

        const category = new Category({
            name: {
                en: req.body.name.en,
                vi: req.body.name.vi
            },
            description: {
                en: req.body.description?.en || '',
                vi: req.body.description?.vi || ''
            },
            imageUrl: req.body.imageUrl || '',
            status: req.body.status || 'active'
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        res.status(400).json({ message: err.message });
    }
});

// Update category
router.patch('/:id', auth, adminAuth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update name
        if (req.body.name != null) {
            if (req.body.name.en != null) {
                category.name.en = req.body.name.en;
            }
            if (req.body.name.vi != null) {
                category.name.vi = req.body.name.vi;
            }
        }

        // Update description
        if (req.body.description != null) {
            if (req.body.description.en != null) {
                category.description.en = req.body.description.en;
            }
            if (req.body.description.vi != null) {
                category.description.vi = req.body.description.vi;
            }
        }

        if (req.body.imageUrl != null) {
            category.imageUrl = req.body.imageUrl;
        }
        if (req.body.status != null) {
            category.status = req.body.status;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        res.status(400).json({ message: err.message });
    }
});

// Delete category
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.remove();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;