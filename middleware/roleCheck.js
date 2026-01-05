// /middleware/roleCheck.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

// Middleware per restringir l'accés segons el rol de l'usuari
// Rep un array de rols permesos (ex: ['admin'])
const roleCheck = (roles) => {
    return (req, res, next) => {
        // Verifiquem:
        // 1. Que l'usuari existeixi (autenticat)
        // 2. Que el seu rol estigui inclòs a la llista de rols permesos
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `El rol d'usuari ${req.user ? req.user.role : 'desconegut'} no té accés a aquest recurs`
        });
        }
        // Si té permís, endavant
        next();
    };
};

module.exports = roleCheck;

// Fet per Álvaro Gómez Fernández