// /utils/promoteToAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');

// ⚠️ ASSEGURA'T QUE AQUEST EMAIL ÉS EL DEL TEU USUARI REGISTRAT
const EMAIL_TO_PROMOTE = 'final@test.com'; 

const promoteUser = async () => {
    try {
        // 👇 AQUÍ POSEM LA TEVA URL LOCAL DIRECTAMENT (La de la foto)
        await mongoose.connect('mongodb://localhost:27017/tasca5');
        
        console.log('🔌 Connectat a la BD Local...');

        // 1. Busquem l'usuari
        const user = await User.findOne({ email: EMAIL_TO_PROMOTE });
        if (!user) {
            console.log(`❌ No s'ha trobat l'usuari amb email: ${EMAIL_TO_PROMOTE}`);
            process.exit(1);
        }

        // 2. Busquem el rol 'admin'
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            console.log('❌ No existeix el rol "admin".');
            process.exit(1);
        }

        // 3. Actualitzem l'usuari
        user.roles = [adminRole._id];
        await user.save();

        console.log(`✅ ÈXIT! L'usuari ${user.name} ara és ADMIN.`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

promoteUser();