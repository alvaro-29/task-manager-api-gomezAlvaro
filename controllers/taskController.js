// controllers/taskController.js - OP1-B1-NODE-06 - Frameworks - Fet per Álvaro Gómez Fernández

const Tasca = require('../models/Task'); 

// OPERACIONS CRUD BÀSIQUES

// Crear una nova tasca
exports.createTask = async (req, res) => {
    try {
        const { titol, description, cost, hours_estimated, hours_real, image, completed, finished_at } = req.body;

        // --- Validacions manuals ---
        if (!titol || cost === undefined || hours_estimated === undefined) {
            return res.status(400).send({ error: 'Falten camps obligatoris.' });
        } 
        if (titol.trim().length < 3 || titol.trim().length > 50) {
            return res.status(400).send({ error: 'El títol ha de tenir entre 3 i 50 caràcters.' });
        }
        if (description && description.trim().length > 500) {
            return res.status(400).send({ error: 'La descripció no pot superar els 500 caràcters.' });
        }
        if (cost < 0) return res.status(400).send({ error: 'El cost no pot ser negatiu.' });
        if (hours_estimated < 0) return res.status(400).send({ error: 'Les hores estimades han de ser positives.' });
        
        // AFEGIT: Assignem l'usuari a la tasca
        const tascaNova = await Tasca.create({
            user: req.user.id, // <--- CLAU: Vinculem la tasca a l'usuari connectat
            titol,
            description,
            cost,
            hours_estimated,
            hours_real,
            image,
            completed,
            finished_at
        });

        res.status(201).send(tascaNova);

    } catch (err) {
        res.status(400).send({ error: "No s'ha pogut crear la tasca", details: err.message });
    }
};

// Llistar totes les tasques (només les meves)
exports.getTasks = async (req, res) => {
    try {
        // CORREGIT: Filtrem per l'usuari actual
        const tasques = await Tasca.find({ user: req.user.id });
        res.status(200).send(tasques);
    } catch (err) {
        res.status(500).send({ error: 'Error obtenint les tasques', details: err.message});
    }
};

// Mostrar una tasca específica per ID (Protegit)
exports.getEspecificTask = async (req, res) => {
    try {
        // CORREGIT: Usem findOne amb el filtre d'usuari
        // Així no pots veure tasques d'altres usuaris encara que tinguis l'ID
        const tasca = await Tasca.findOne({ _id: req.params.id, user: req.user.id });

        if (!tasca) {
            return res.status(404).send({ error: "Tasca no trobada o no tens permís" });
        }
        res.status(200).send(tasca);
    } catch (err) {
        res.status(400).send({ error: 'ID invàlid o error en la consulta', details: err.message });
    }
};

// Actualitzar una tasca específica (Protegit)
exports.updateTask = async (req, res) => {
    try {
        // CORREGIT: findOneAndUpdate amb filtre d'usuari
        const tascaUpdated = await Tasca.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!tascaUpdated) {
            return res.status(404).send({ message: 'Tasca no trobada o no tens permís' });
        }
        res.status(200).send(tascaUpdated);
    } catch (err) {
        res.status(400).send({ error: 'Error actualitzant la tasca', details: err.message });
    }
};

// Eliminar una tasca específica (Protegit)
exports.deleteTask = async (req, res) => {
    try {
        // CORREGIT: findOneAndDelete amb filtre d'usuari
        const tascaEliminada = await Tasca.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.id 
        });

        if (!tascaEliminada) {
            return res.status(404).send({ message: 'Tasca no trobada o no tens permís' });
        }
        res.status(200).send({ message: 'Tasca eliminada amb èxit', tasca: tascaEliminada });
    } catch (err) {
        res.status(500).send({ error: 'Error eliminant la tasca', details: err.message });
    }
};

// GESTIÓ D'IMATGES (Protegit)

exports.updateTaskImage = async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).send({ error: 'Cal proporcionar una URL' });

        // CORREGIT: findOneAndUpdate en lloc de findByIdAndUpdate
        const tascaUpdated = await Tasca.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { image: image },
            { new: true, runValidators: true }
        );

        if (!tascaUpdated) return res.status(404).send({ message: 'Tasca no trobada o no tens permís' });
        res.status(200).send(tascaUpdated);
    } catch (err) {
        res.status(400).send({ error: 'Error actualitzant la imatge', details: err.message });
    }
};

exports.resetTaskImageToDefault = async (req, res) => {
    try {
        // CORREGIT: findOneAndUpdate en lloc de findByIdAndUpdate
        const tascaUpdated = await Tasca.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { image: null },
            { new: true }
        );

        if (!tascaUpdated) return res.status(404).send({ message: 'Tasca no trobada o no tens permís' });
        res.status(200).send({ message: 'Imatge restablerta per defecte', tasca: tascaUpdated });
    } catch (err) {
        res.status(400).send({ error: 'Error resetejant la imatge', details: err.message });
    }
};

// ESTADÍSTIQUES (Protegides: Només les meves dades)
exports.getTaskStats = async (req, res) => {
    try {
        // CORREGIT: Importantíssim! Només calculem estadístiques de les MEVES tasques
        const tasques = await Tasca.find({ user: req.user.id });

        const totalTasks = tasques.length;
        const completedTasks = tasques.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

        const totalCost = tasques.reduce((acc, tasca) => acc + (tasca.cost || 0), 0);
        const completedTasksCost = tasques.reduce((acc, tasca) => tasca.completed ? acc + (tasca.cost || 0) : acc, 0);
        const pendingTasksCost = tasques.reduce((acc, tasca) => tasca.completed ? acc : acc + (tasca.cost || 0), 0);
        const averageCostPerTask = totalTasks ? (totalCost / totalTasks).toFixed(2) : 0;

        const totalHoursEstimated = tasques.reduce((acc, t) => acc + (t.hours_estimated || 0), 0);
        const totalHoursReal = tasques.reduce((acc, t) => acc + (t.hours_real || 0), 0);
        const hoursSaved = totalHoursEstimated - totalHoursReal;

        res.status(200).send({
            success: true,
            data: {
                overview: { totalTasks, completedTasks, pendingTasks, completionRate },
                financial: { totalCost, completedTasksCost, pendingTasksCost, averageCostPerTask },
                time: { totalHoursEstimated, totalHoursReal, hoursSaved }
            }
        });
    } catch (err) {
        res.status(500).send({ error: 'Error obtenint estadístiques', details: err.message });
    }
};

// Fet per Álvaro Gómez Fernández