// /utils/seedPermissions.js - Script per crear permisos inicials
const Permission = require('../models/Permission');

const permissions = [
    // TASQUES
    { name: 'tasks:create', description: 'Crear noves tasques', category: 'tasks' },
    { name: 'tasks:read', description: 'Veure tasques', category: 'tasks' },
    { name: 'tasks:update', description: 'Editar tasques existents', category: 'tasks' },
    { name: 'tasks:delete', description: 'Eliminar tasques', category: 'tasks' },
    
    // USUARIS
    { name: 'users:manage', description: 'Crear i editar usuaris', category: 'users' },
    { name: 'users:read', description: 'Veure llistat d\'usuaris', category: 'users' },
    
    // ROLS
    { name: 'roles:manage', description: 'Crear i editar rols', category: 'roles' },
    { name: 'roles:read', description: 'Veure rols disponibles', category: 'roles' },
    
    // PERMISOS
    { name: 'permissions:manage', description: 'Gestionar permisos', category: 'permissions' },
    { name: 'permissions:read', description: 'Veure permisos', category: 'permissions' },
    
    // AUDITORIA I INFORMES
    { name: 'audit:read', description: 'Veure registres d\'auditoria', category: 'audit' },
    { name: 'reports:view', description: 'Veure informes globals', category: 'reports' },
    { name: 'reports:export', description: 'Exportar dades', category: 'reports' }
];

const seedPermissions = async () => {
    try {
        // Recorrem la llista de permisos
        for (const perm of permissions) {
            // updateOne busca un document que coincideixi amb el filtre (name)
            // Si el troba, l'actualitza. Si no, el crea (gràcies a upsert: true)
            await Permission.updateOne(
                { name: perm.name }, // Filtre: busquem pel nom
                { 
                    $set: { 
                        description: perm.description, 
                        category: perm.category,
                        isSystemPermission: true // Marquem com a sistema perquè no s'esborrin fàcilment
                    } 
                },
                { upsert: true } // Si no existeix, el crea (Insert). Si existeix, l'actualitza (Update).
            );
        }
        console.log('✅ Permisos verificats/creats correctament.');
    } catch (error) {
        console.error('❌ Error creant permisos:', error);
    }
};

module.exports = seedPermissions;