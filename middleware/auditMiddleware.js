// middleware/auditMiddleware.js
const AuditLog = require('../models/AuditLog');

const auditMiddleware = (actionName) => {
    return async (req, res, next) => {
        // Guardem l'inici de la petició
        const startTime = Date.now();
        
        // Interceptem el final de la resposta
        res.on('finish', async () => {
            try {
                // Només registrem si l'usuari està autenticat
                if (req.user) {
                    // Determinem l'estat (2xx o 3xx és èxit, 4xx o 5xx és error)
                    const status = res.statusCode >= 400 ? 'error' : 'success';
                    
                    // Intentem endevinar quin recurs s'ha tocat
                    // Si la ruta té :id, el capturem
                    const resourceId = req.params.id || req.params.userId || null;

                    // Creem el registre
                    await AuditLog.create({
                        userId: req.user._id,
                        action: actionName,      // Ex: 'tasks:create'
                        resource: resourceId,    // ID de l'objecte (si n'hi ha)
                        resourceType: req.baseUrl.split('/')[2], // Ex: 'tasks', 'users'
                        status: status,
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent'],
                        errorMessage: status === 'error' ? res.statusMessage : null
                    });
                    
                    console.log(`📝 Auditoria registrada: ${actionName} (${status})`);
                }
            } catch (error) {
                console.error('❌ Error guardant auditoria:', error);
            }
        });

        next();
    };
};

module.exports = auditMiddleware;