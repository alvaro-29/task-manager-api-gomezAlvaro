// taskRoute.js - OP1-B1-NODE-05 - Frameworks - Fet per Álvaro Gómez Fernández

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const protect = require('../middleware/auth');

const checkPermission = require('../middleware/checkPermission');
const audit = require('../middleware/auditMiddleware');

router.get('/stats', protect, checkPermission('tasks:read'), taskController.getTaskStats);  // Obtenir estadístiques
router.post('', protect, checkPermission('tasks:create'), audit('tasks:create'), taskController.createTask); // Crear una tasca
router.get('', protect, checkPermission('tasks:read'), taskController.getTasks);  // Obtenir totes les tasques
router.get('/:id', protect, checkPermission('tasks:read'), taskController.getEspecificTask)  // Obtenir tasca específica
router.put('/:id', protect, checkPermission('tasks:update'), audit('tasks:update'), taskController.updateTask);  // Actualitzar una tasca
router.delete('/:id', protect, checkPermission('tasks:delete'), audit('tasks:delete'), taskController.deleteTask);  // Eliminar una tasca

router.put('/:id/image', protect, checkPermission('tasks:update'), taskController.updateTaskImage);  // Actualitzar imatge de tasca
router.delete('/:id/image', protect, checkPermission('tasks:update'), taskController.resetTaskImageToDefault);  // Restablir imatge per defecte

module.exports = router;

// Fet per Álvaro Gómez Fernández