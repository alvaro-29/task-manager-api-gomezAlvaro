const mongoose = require('mongoose');


const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // El nom del permís ha de ser únic (ex: 'tasks:create')
        trim: true
    },
    description: {
        type: String,
        required: true, // Expliquem què fa el permís
        trim: true
    },
    category: {
        type: String,
        required: true, // Agrupem permisos: 'tasks', 'users', 'reports', etc.
        trim: true
    },
    isSystemPermission: {
        type: Boolean,
        default: false // Si és true, no es pot esborrar des de l'API (permís crític)
    }
}, {
    timestamps: true // Afegeix createdAt i updatedAt automàticament
});

module.exports = mongoose.model('Permission', permissionSchema);