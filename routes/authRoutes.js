// /routes/authRoutes.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const protect = require('../middleware/auth');
const { registerValidation, loginValidation, updateProfileValidation, changePasswordValidation } = require('../middleware/validators/authValidators');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;

// Fet per Álvaro Gómez Fernández