// /middleware/checkPermission.js
const User = require('../models/User');

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Verifiquem que l'usuari està autenticat
            if (!req.user || !req.user._id) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Accés denegat. Usuari no autenticat.' 
                });
            }

            // Busquem l'usuari complet a la BD per obtenir els seus rols actualitzats
            // (req.user del token a vegades té dades antigues)
            const user = await User.findById(req.user._id);
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Usuari no trobat.' 
                });
            }

            // Obtenim la llista de tots els permisos que té l'usuari
            // Usant el mètode que acabem de crear al model
            const effectivePermissions = await user.getEffectivePermissions();

            // Verifiquem si té el permís necessari
            // Cas especial: Si té permís 'admin:all', ho pot fer tot (opcional, però útil)
            if (effectivePermissions.includes(requiredPermission)) {
                // Té permís! Deixem passar
                req.effectivePermissions = effectivePermissions; // Guardem per si es necessita després
                return next();
            }

            // Si arribem aquí, és que NO té permís
            return res.status(403).json({
                success: false,
                message: 'No tens permís per realitzar aquesta acció.',
                requiredPermission: requiredPermission
            });

        } catch (error) {
            console.error('Error al verificar permisos:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error del servidor al verificar permisos.' 
            });
        }
    };
};

module.exports = checkPermission;