const mongoose = require('mongoose');

// Esquema per definir un rol (conjunt de permisos)
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ex: 'admin', 'editor', 'viewer'
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission' // Referència a l'ID del model Permission
        // Això ens permetrà fer .populate('permissions') i veure els detalls
    }],
    isSystemRole: {
        type: Boolean,
        default: false // Si és true, no es pot esborrar ni modificar el nom (ex: admin)
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);