// routes/permissionRoutes.js
const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const protect = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// RUTES: /api/admin/permissions

// Crear permís (Només Admin)
// Nota: Usem 'permissions:manage' si el tens creat, si no, amb ser admin n'hi ha prou de moment.
router.post('/', 
    protect, 
    checkPermission('permissions:manage'), 
    permissionController.createPermission
);

// Veure tots els permisos
router.get('/', 
    protect, 
    checkPermission('permissions:read'), 
    permissionController.getAllPermissions
);

module.exports = router;