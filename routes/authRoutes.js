// /routes/authRoutes.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

const express = require('express');
const router = express.Router();

// 1. IMPORTEM EL CONTROLADOR COM UN OBJECTE SENCER ('authController')
const authController = require('../controllers/authController');

// 2. IMPORTEM EL MIDDLEWARE
const protect = require('../middleware/auth');

// --- RUTES ---

// Registre i Login (fan servir authController.funcio)
router.post('/register', authController.register);
router.post('/login', authController.login);

// NOVA RUTA: Verificar permís (protegida)
router.post('/check-permission', protect, authController.checkPermission);

module.exports = router;

// Fet per Álvaro Gómez Fernández