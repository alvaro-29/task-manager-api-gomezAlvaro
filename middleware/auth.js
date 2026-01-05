// /middleware/auth.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware per protegir rutes - verifica el token JWT
const protect = async (req, res, next) => {
    let token;

    // 1. Busquem el token a la capçalera 'Authorization'
    // El format esperat és: "Bearer eyJhbGciOiJIUzI1Ni..."
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraiem el token (treiem la paraula 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Verifiquem que el token sigui vàlid i no hagi expirat
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Busquem l'usuari a la BD corresponent a aquest token
            // .select('-password') serveix per NO portar la contrasenya a la memòria
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Usuari no trobat amb aquest token' });
            }

            // Tot correcte -> Passem al següent middleware (el controlador)
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, error: 'No autoritzat, token no vàlid' });
        }
    }

    // Si no hi ha token a la capçalera
    if (!token) {
        return res.status(401).json({ success: false, error: 'No autoritzat, no hi ha token' });
    }
};

module.exports = protect;

// Fet per Álvaro Gómez Fernández