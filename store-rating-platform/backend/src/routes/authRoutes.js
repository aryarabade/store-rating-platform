const express = require('express');
const router = express.Router();

const { signup, login, updatePassword, getMe } = require('../controllers/authController');
const { validateSignup, validateLogin, validatePasswordUpdate } = require('../validators/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes (any logged-in role)
router.get('/me', authMiddleware, getMe);
router.put('/update-password', authMiddleware, validatePasswordUpdate, updatePassword);

module.exports = router;
