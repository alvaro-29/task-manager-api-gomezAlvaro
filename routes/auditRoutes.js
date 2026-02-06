// routes/auditRoutes.js
const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

// Importem middlewares de seguretat
const protect = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// RUTA: GET / (que serà /api/admin/audit-logs)
// Només pot entrar qui tingui permís 'audit:read' (o sigui, l'Admin)
router.get('/', 
    protect, 
    checkPermission('audit:read'), 
    auditController.getAuditLogs
);

router.get('/stats', protect, checkPermission('audit:read'), auditController.getAuditStats);

module.exports = router;