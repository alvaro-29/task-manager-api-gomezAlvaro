// taskRoute.js - OP1-B1-NODE-05 - Frameworks - Fet per Álvaro Gómez Fernández

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const protect = require('../middleware/auth');

router.get('/stats', protect, taskController.getTaskStats);  // Obtenir estadístiques
router.post('', protect, taskController.createTask); // Crear una tasca
router.get('', protect, taskController.getTasks);  // Obtenir totes les tasques
router.get('/:id', protect, taskController.getEspecificTask)  // Obtenir tasca específica
router.put('/:id', protect, taskController.updateTask);  // Actualitzar una tasca
router.delete('/:id', protect, taskController.deleteTask);  // Eliminar una tasca

router.put('/:id/image', protect, taskController.updateTaskImage);  // Actualitzar imatge de tasca
router.delete('/:id/image', protect, taskController.resetTaskImageToDefault);  // Restablir imatge per defecte

module.exports = router;

// Fet per Álvaro Gómez Fernández