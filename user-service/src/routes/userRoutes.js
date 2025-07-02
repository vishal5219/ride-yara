const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.post('/register', validate.validateRegister, userController.register);
router.post('/login', userController.login);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.get('/history', auth, userController.getHistory);
router.get('/ratings', auth, userController.getRatings);

module.exports = router; 