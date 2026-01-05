// /routes/adminRoutes.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández


const express = require('express');
const router = express.Router();

// Importem el controlador d'administració
const { getAllUsers, deleteUser } = require('../controllers/adminController');

// Importem els middlewares de seguretat
const protect = require('../middleware/auth');      // Per verificar el token
const roleCheck = require('../middleware/roleCheck'); // Per verificar si és admin

// --- Rutes d'Administració ---

// Obtenir tots els usuaris
// Primer passem 'protect' (ha d'estar loguejat)
// Després 'roleCheck' (ha de ser admin)
router.get('/users', protect, roleCheck(['admin']), getAllUsers);

// Eliminar un usuari per ID
router.delete('/users/:id', protect, roleCheck(['admin']), deleteUser);

module.exports = router;

// Fet per Álvaro Gómez Fernández