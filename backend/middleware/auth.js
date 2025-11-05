const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        console.log('🔐 Auth middleware - Checking token...');
        
        // Lấy token từ header
        const authHeader = req.header('Authorization');
        console.log('📋 Authorization header:', authHeader);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ No Bearer token found');
            return res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('🔑 Token extracted');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        console.log('✅ Token decoded for user ID:', decoded.id);
        
        // Tìm user từ token
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.log('❌ User not found for ID:', decoded.id);
            return res.status(401).json({ 
                message: 'Token is invalid. User not found.' 
            });
        }

        console.log('✅ User authenticated:', user.email);
        
        // Gắn user vào request
        req.user = user;
        next();
    } catch (error) {
        console.error('💥 Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        }
        
        res.status(500).json({ message: 'Server error in authentication.' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        console.log('👨‍💼 Admin auth middleware');
        await auth(req, res, () => {});
        
        if (req.user.role !== 'admin') {
            console.log('❌ User is not admin:', req.user.role);
            return res.status(403).json({ 
                message: 'Access denied. Admin role required.' 
            });
        }
        
        console.log('✅ User is admin, access granted');
        next();
    } catch (error) {
        console.error('💥 Admin auth error:', error);
        res.status(500).json({ message: 'Server error in admin authentication.' });
    }
};

module.exports = { auth, adminAuth };