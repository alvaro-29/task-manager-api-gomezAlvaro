// /utils/generateToken.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

const jwt = require('jsonwebtoken');

// Funció per generar un JWT amb l'ID, email i rol de l'usuari
const generateToken = (user) => {
    // Signem el token amb la clau secreta del .env
    return jwt.sign(
        { 
            userId: user._id, 
            email: user.email, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        {
        expiresIn: process.env.JWT_EXPIRES_IN // Temps d'expiració (ex: 7d)
        }
    );
};

module.exports = generateToken;

// Fet per Álvaro Gómez Fernández