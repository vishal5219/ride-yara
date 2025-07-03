const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');
const { body } = require('express-validator');

// Input validation for register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim().escape(),
  body('name').optional().trim().escape()
], userController.register);

router.post('/login', userController.login);
router.get('/profile', authenticateToken, userController.getProfile);
// Input validation for updateProfile
router.put('/profile', [
  authenticateToken,
  body('name').optional().trim().escape(),
  body('email').optional().isEmail().normalizeEmail()
], userController.updateProfile);
router.get('/history', authenticateToken, userController.getHistory);
router.get('/ratings', authenticateToken, userController.getRatings);

module.exports = router; 