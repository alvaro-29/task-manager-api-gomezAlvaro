// /routes/adminRoutes.js - OP1-B1-NODE-05 - Frameworks - Fet per Álvaro Gómez Fernández

const express = require('express');
const router = express.Router();

// 1. Importem middlewares de seguretat
const protect = require('../middleware/auth');           // Autenticació (Qui ets?)
const checkPermission = require('../middleware/checkPermission'); // Autorització (Què pots fer?)

// 2. Importem els controladors
const roleController = require('../controllers/roleController'); // <--- NOU: Gestió de rols
const adminController = require('../controllers/adminController'); // El teu controlador antic d'usuaris

// --- RUTES DE GESTIÓ DE ROLS (NOU) ---

// Crear un nou rol (Necessita permís 'roles:manage')
router.post('/roles', 
    protect, 
    checkPermission('roles:manage'), 
    roleController.createRole
);

// Veure tots els rols (Necessita permís 'roles:read')
router.get('/roles', 
    protect, 
    checkPermission('roles:read'), 
    roleController.getRoles
);


// --- RUTES DE GESTIÓ D'USUARIS (ADAPTADES) ---

// Obtenir tots els usuaris
// Abans usaves roleCheck(['admin']), ara usem permís granular 'users:read'
router.get('/users', 
    protect, 
    checkPermission('users:read'), 
    adminController.getAllUsers
);

// Eliminar un usuari per ID
// Ara necessites permís 'users:manage' per esborrar gent
router.delete('/users/:id', 
    protect, 
    checkPermission('users:manage'), 
    adminController.deleteUser
);

router.post('/users/:userId/roles', 
    protect, 
    checkPermission('users:manage'), // Necesitas permiso de gestionar usuarios
    roleController.assignRoleToUser
)

// Obtener permisos de un usuario
router.get('/users/:userId/permissions', 
    protect, 
    checkPermission('users:read'), 
    adminController.getUserPermissions // <--- La función que acabamos de crear
);

router.delete('/roles/:id', protect, checkPermission('roles:manage'), roleController.deleteRole);

router.put('/roles/:id', protect, checkPermission('roles:manage'), roleController.updateRole);

module.exports = router;

// Fet per Álvaro Gómez Fernández