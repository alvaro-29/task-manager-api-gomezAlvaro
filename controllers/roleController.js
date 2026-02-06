// controllers/roleController.js
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');

// Crear un nuevo rol
exports.createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        // Validar que el nombre no esté repetido
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: 'Ja existeix un rol amb aquest nom.'
            });
        }

        // Validar que los permisos que nos envían existen de verdad
        // (Esto evita que guardemos IDs inventados)
        if (permissions && permissions.length > 0) {
            const validPermissions = await Permission.countDocuments({
                _id: { $in: permissions }
            });

            if (validPermissions !== permissions.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Un o més permisos no existeixen a la base de dades.'
                });
            }
        }

        // Crear el rol
        const newRole = await Role.create({
            name,
            description,
            permissions
        });

        res.status(201).json({
            success: true,
            data: newRole
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el rol',
            error: error.message
        });
    }
};

// Obtenir tots els rols
exports.getRoles = async (req, res) => {
    try {
        // Usem populate per veure els detalls
        const roles = await Role.find().populate('permissions');

        res.status(200).json({
            success: true,
            count: roles.length,
            data: roles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtenir els rols'
        });
    }
};

// ASIGNAR UN ROL A UN USUARIO
exports.assignRoleToUser = async (req, res) => {
    try {
        const { userId } = req.params; // Viene de la URL
        const { roleId } = req.body;   // Viene del JSON

        // 1. Busquem l'usuari
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuari no trobat' });
        }

        // 2. Busquem el rol
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Rol no trobat' });
        }

        // 3. Evitem duplicats (si ja té el rol, no fem res)
        if (user.roles.includes(roleId)) {
            return res.status(400).json({ success: false, message: 'L\'usuari ja té aquest rol assigned.' });
        }

        // 4. Afegim el rol i guardem
        user.roles.push(roleId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Rol assignat correctament',
            data: {
                userId: user._id,
                userName: user.name,
                roles: user.roles
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al assignar rol' });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        
        if (!role) {
            return res.status(404).json({ success: false, message: 'Rol no trobat' });
        }

        res.status(200).json({
            success: true,
            message: 'Rol eliminat correctament'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al eliminar rol' });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;
        
        // Buscamos el rol por ID y lo actualizamos con los datos nuevos
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { name, description, permissions },
            { new: true, runValidators: true } // Opciones para devolver el dato nuevo
        );

        if (!role) {
            return res.status(404).json({ success: false, message: 'Rol no trobat' });
        }

        res.status(200).json({
            success: true,
            message: 'Rol actualitzat correctament',
            data: role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualitzar rol' });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        
        res.status(200).json({
            success: true,
            count: roles.length,
            data: roles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtenir rols' });
    }
};