// controllers/auditController.js
const AuditLog = require('../models/AuditLog'); // Assegura't que el model existeix

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtenir els registres d\'auditoria' 
        });
    }
};

exports.getAuditStats = async (req, res) => {
    try {
        // Comptar total d'accions
        const totalActions = await AuditLog.countDocuments();
        
        res.status(200).json({
            success: true,
            data: {
                totalActions: totalActions,
                message: "Estadístiques calculades correctament"
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error en estadístiques' });
    }
};