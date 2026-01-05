// /middleware/validators/authValidators.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

const { body } = require('express-validator');

// Validacions per al registre d'usuaris
exports.registerValidation = [
    body('name')
        .optional()
        .isLength({ min: 2 }).withMessage('El nom ha de tenir com a mínim 2 caràcters'),
    body('email')
        .isEmail().withMessage('Si us plau, introdueix un email vàlid'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contrasenya ha de tenir com a mínim 6 caràcters')
];

// Validacions per a l'inici de sessió
exports.loginValidation = [
    body('email')
        .isEmail().withMessage('Si us plau, introdueix un email vàlid'),
    body('password')
        .notEmpty().withMessage('La contrasenya és obligatòria')
];

// Validacions per canviar la contrasenya
exports.changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('La contrasenya actual és obligatòria'),
    body('newPassword')
        .isLength({ min: 6 }).withMessage('La nova contrasenya ha de tenir com a mínim 6 caràcters')
];

// Validacions per actualitzar el perfil
exports.updateProfileValidation = [
    body('email')
        .optional()
        .isEmail().withMessage('Email no vàlid'),
    body('name')
        .optional()
        .isLength({ min: 2 }).withMessage('El nom ha de tenir mínim 2 caràcters')
];

// Fet per Álvaro Gómez Fernández