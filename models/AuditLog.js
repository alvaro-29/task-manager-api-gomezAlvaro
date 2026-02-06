const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Sempre hem de saber qui ha fet l'acció
    },
    action: {
        type: String,
        required: true, // Ex: 'tasks:create', 'auth:login_failed'
        trim: true
    },
    resource: {
        type: String, // ID de l'objecte afectat (ex: ID de la tasca)
        trim: true
    },
    resourceType: {
        type: String, // Ex: 'task', 'user', 'role'
        trim: true
    },
    status: {
        type: String,
        enum: ['success', 'error'], // Només permetem aquests dos estats
        required: true
    },
    changes: {
        type: Object, // Aquí guardarem un JSON amb el "abans" i "després" (molt útil!)
    },
    errorMessage: {
        type: String // Si ha fallat, guardem per què
    },
    ipAddress: {
        type: String // Per seguretat, saber des d'on s'ha connectat
    },
    userAgent: {
        type: String // Navegador i Sistema Operatiu
    }
}, {
    timestamps: true // Ens dona el 'createdAt' automàticament (el 'quan')
});

// Indexem per fer cerques ràpides per usuari o acció
auditLogSchema.index({ userId: 1, action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);