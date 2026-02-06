// /utils/seedRoles.js
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const seedRoles = async () => {
    try {
        // Obtenim TOTS els permisos de la BD
        const allPermissions = await Permission.find({});
        
        // Creem un mapa ràpid per trobar IDs pel seu nom
        // Exemple: { 'tasks:create': '65a...', 'users:read': '65b...' }
        const permMap = {};

        allPermissions.forEach(p => {
            permMap[p.name] = p._id;
        });

        // Definim quins permisos té cada rol
        // ROL VIEWER: Només pot llegir tasques
        const viewerPermissions = [
            permMap['tasks:read']
        ].filter(id => id); // El filter elimina undefined si algun permís no existís

        // ROL USER: Pot gestionar tasques (la lògica de "només les seves" va al controlador)
        const userPermissions = [
            permMap['tasks:create'],
            permMap['tasks:read'],
            permMap['tasks:update'],
            permMap['tasks:delete']
        ].filter(id => id);

        // ROL EDITOR: Igual que user però potser en el futur té més coses.
        // De moment li donem els mateixos permisos de tasques.
        const editorPermissions = [
            permMap['tasks:create'],
            permMap['tasks:read'],
            permMap['tasks:update'],
            permMap['tasks:delete']
        ].filter(id => id);

        // ROL ADMIN: Té TOTS els permisos existents
        const adminPermissions = allPermissions.map(p => p._id);

        // Creem/Actualitzem els rols
        const roles = [
            { 
                name: 'viewer', 
                description: 'Només pot veure tasques', 
                permissions: viewerPermissions,
                isSystemRole: false
            },
            { 
                name: 'user', 
                description: 'Usuari estàndard (gestiona les seves tasques)', 
                permissions: userPermissions,
                isSystemRole: true // No es pot esborrar
            },
            { 
                name: 'editor', 
                description: 'Editor de contingut', 
                permissions: editorPermissions,
                isSystemRole: false
            },
            { 
                name: 'admin', 
                description: 'Administrador total del sistema', 
                permissions: adminPermissions,
                isSystemRole: true // No es pot esborrar
            }
        ];

        for (const role of roles) {
            await Role.updateOne(
                { name: role.name },
                { $set: role },
                { upsert: true }
            );
        }

        console.log('✅ Rols verificats/creats correctament.');

    } catch (error) {
        console.error('❌ Error creant rols:', error);
    }
};

module.exports = seedRoles;