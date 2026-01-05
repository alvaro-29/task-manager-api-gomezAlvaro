// /controllers/adminController.js - tasca7 - GESTOR DE TASQUES - Autentificació - Frameworks - Fet per Álvaro Gómez Fernández

const User = require('../models/User');
const Task = require('../models/Task'); // Importem Task per esborrar les tasques de l'usuari eliminat

exports.getAllUsers = async (req, res) => {
    try {
        // Busquem tots els usuaris a la BD
        // .select('-password') serveix per NO retornar la contrasenya (seguretat)
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor al obtenir usuaris' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // 1. Busquem l'usuari per ID
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'Usuari no trobat' });
        }

        // 2. Opcional però recomanable: Esborrar també les tasques d'aquest usuari
        // Així no deixem "escombraries" a la base de dades
        await Task.deleteMany({ user: user._id });

        // 3. Eliminem l'usuari
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Usuari i les seves tasques eliminats correctament'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor al eliminar usuari' });
    }
};

// Fet per Álvaro Gómez Fernández