const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepuestoSchema = new Schema ({
    idTecnico: { type: Schema.Types.ObjectId, ref: 'Persona', required: [true, 'Requiere idTecnico'] },
    idReclamo: { type: Schema.Types.ObjectId, ref: 'Reclamo', required: [true, 'Requiere idReclamo'] },
    repuesto: { type: String, required: [true, 'Requiere repuesto'] },
    observacion: { type: String, required: [true, 'Requiere observacion'] },
    fechaArchivado: Date
}, { versionKey: false });

module.exports = mongoose.model('Repuesto', RepuestoSchema);