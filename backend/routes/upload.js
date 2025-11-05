const express = require('express');
const router = express.Router();
const { uploadMultiple, uploadSingle } = require('../middleware/upload');

// Upload multiple images
router.post('/images', uploadMultiple, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    // Tạo URLs cho frontend
    const imageUrls = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });

    res.json({
      message: 'Upload ảnh thành công',
      images: imageUrls,
      count: imageUrls.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload single image
router.post('/image', uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: 'Upload ảnh thành công',
      image: imageUrl
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload banner
router.post('/banner', uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    const bannerUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: 'Upload banner thành công',
      banner: bannerUrl
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;