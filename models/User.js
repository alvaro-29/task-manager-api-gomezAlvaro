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
    role: {
        type: String,
        enum: ['user', 'admin'], // Només permetem aquests dos valors
        default: 'user'
    },
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

// Exportem el model per poder-lo usar a altres fitxers
module.exports = mongoose.model('User', UserSchema);

// Fet per Álvaro Gómez Fernández