// /models/User.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Si us plau, afegeix un email'],
        unique: true, // L'email ha de ser únic a la BD
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Si us plau, afegeix un email vàlid'
        ]
    },
    password: {
        type: String,
        required: [true, 'Si us plau, afegeix una contrasenya'],
        minlength: 6,
        select: false // Per defecte no retornem la contrasenya en les consultes (seguretat)
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware (Hook) pre-save per xifrar la contrasenya abans de guardar
UserSchema.pre('save', async function(next) {
    // Si la contrasenya no s'ha modificat, passem al següent middleware i no fem res
    if (!this.isModified('password')) {
        return next();
    }

    // Generem el salt (soroll aleatori) i xifrem la contrasenya amb bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Mètode per comparar la contrasenya introduïda (text pla) amb la xifrada a la BD
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Mètode per eliminar camps sensibles (com password) al retornar l'objecte JSON
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

UserSchema.methods.getEffectivePermissions = async function() {
    // 1. Omplim (populate) les dades dels rols i els seus permisos
    // Això converteix els IDs en els objectes reals de la base de dades
    await this.populate({
        path: 'roles',
        populate: {
            path: 'permissions'
        }
    });

    // Utilitzem un Set per evitar permisos duplicats
    // (Si ets 'editor' i 'admin', els dos tenen 'tasks:read', no volem tenir-lo dos cops)
    const permissionsSet = new Set();

    // Recorrem cada rol de l'usuari
    this.roles.forEach(role => {
        // Recorrem cada permís dins del rol
        role.permissions.forEach(permission => {
            permissionsSet.add(permission.name); // Afegim el nom (ex: 'tasks:create')
        });
    });

    // Retornem un array amb els permisos únics
    return Array.from(permissionsSet);
};

// Exportem el model per poder-lo usar a altres fitxers
module.exports = mongoose.model('User', UserSchema);

// Fet per Álvaro Gómez Fernández