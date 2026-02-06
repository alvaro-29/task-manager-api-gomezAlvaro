// /models/authController.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');
const Role = require('../models/Role');

exports.register = async (req, res) => {
  // Revisem si hi ha errors de validació (els que hem definit al middleware validators)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Comprovem si l'email ja està registrat a la BD
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
            success: false,
            error: 'Aquest email ja està registrat'
        });
    }

    // Busque el rol 'user' a la BD
    const userRole = await Role.findOne({ name: 'user' });

        // Per seguretat, si per algun motiu no existeix el rol (no has fet el seed), donem error
        if (!userRole) {
            return res.status(500).json({ 
                success: false, 
                error: 'Error del sistema: No existeix el rol "user" a la BD.' 
            });
        }

    // Creem el nou usuari
    // La contrasenya es xifrarà automàticament gràcies al middleware 'pre-save' del model User
    user = await User.create({
        name,
        email,
        password,
        roles: [userRole._id]
    });

    // 4. Generem el token JWT perquè l'usuari quedi loguejat directament
    const token = generateToken(user);

    // 5. Retornem resposta exitosa
    res.status(201).json({
        success: true,
        message: 'Usuari registrat correctament',
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: ['user'],
                createdAt: user.createdAt
            }
        }
    });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor al registrar usuari' });
    }
};

// @desc    Actualitzar perfil
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { name, email } = req.body;
        
        // Si l'usuari vol canviar l'email, verifiquem que no estigui agafat per un altre
        if (email && email !== req.user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ success: false, error: 'Aquest email ja està en ús' });
            }
        }

        // Actualitzem les dades
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true } // new: true retorna l'usuari modificat
        );

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error al actualitzar perfil' });
    }
};

// @desc    Canviar contrasenya
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;

        try {
            // Necessitem la contrasenya actual per comparar, així que usem select('+password')
            const user = await User.findById(req.user.id).select('+password');

            // Verifiquem que la contrasenya actual sigui correcta
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ success: false, error: 'La contrasenya actual és incorrecta' });
            }

            // Actualitzem amb la nova contrasenya
            user.password = newPassword;
        
            // Guardem (això dispararà el middleware pre-save que la xifrarà)
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Contrasenya actualitzada correctament'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error al canviar la contrasenya' });
        }
};

// @desc    Iniciar sessió (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  // 1. Validació de camps bàsics
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 2. Busquem l'usuari per email i incloem la contrasenya
        // Necessitem el camp password (que està ocult per defecte) per comparar-lo
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Credencials incorrectes' });
        }

        // 3. Comprovem la contrasenya usant el mètode que vam crear al model User
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Credencials incorrectes' });
        }

    // 4. Si tot és correcte, generem el token
    const token = generateToken(user);

    // 5. Retornem el token i les dades de l'usuari
    res.status(200).json({
        success: true,
        message: 'Sessió iniciada correctament',
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor al iniciar sessió' });
    }
};

// @desc    Obtenir l'usuari actual (Perfil)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // L'usuari ja està disponible a req.user gràcies al middleware 'auth'
        // Tornem a buscar-lo per assegurar que tenim les dades més recents
        const user = await User.findById(req.user.id);

        res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

exports.checkPermission = async (req, res) => {
    try {
        const { permission } = req.body;
        const user = req.user; // L'usuari ja ve del middleware 'protect'

        // 1. Tornem a buscar l'usuari per carregar els seus Rols i Permisos
        // (El req.user del middleware de vegades no porta els 'populate' fets)
        const User = require('../models/User'); // Assegura't de tenir el model
        const userFull = await User.findById(user._id).populate({
            path: 'roles',
            populate: { path: 'permissions' }
        });

        // 2. Revisem si algun dels seus rols té el permís que busquem
        let hasPermission = false;
        
        // Si és ADMIN del sistema, té permís per tot (opcional, però recomanable)
        const isAdmin = userFull.roles.some(r => r.name === 'admin');
        if (isAdmin) hasPermission = true;
        
        // Si no és admin, busquem el permís explícitament
        if (!hasPermission) {
            hasPermission = userFull.roles.some(role => 
                role.permissions.some(p => p.name === permission)
            );
        }

        if (hasPermission) {
            return res.status(200).json({
                success: true,
                hasPermission: true,
                message: "Tens permís per fer aquesta acció"
            });
        } else {
            return res.status(403).json({
                success: false,
                hasPermission: false,
                message: "No tens permís per fer aquesta acció"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al verificar permís' });
    }
};

// Fet per Álvaro Gómez Fernández