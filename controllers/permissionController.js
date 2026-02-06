// controllers/permissionController.js
const Permission = require('../models/Permission');

exports.createPermission = async (req, res) => {
    try {
        const { name, description, category } = req.body;

        // Validar si ja existeix
        const existingPermission = await Permission.findOne({ name });
        if (existingPermission) {
            return res.status(400).json({
                success: false,
                message: 'Ja existeix un permís amb aquest nom'
            });
        }

        const permission = await Permission.create({
            name,
            description,
            category
        });

        res.status(201).json({
            success: true,
            message: 'Permís creat correctament',
            data: permission
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al crear permís' });
    }
};

exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json({
            success: true,
            count: permissions.length,
            data: permissions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtenir permisos' });
    }
};