var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RepuestoSchema = new Schema ({
    idTecnico: { type: Schema.Types.ObjectId, ref: 'Tecnico', required: [true, 'Requiere idTecnico'] },
    idReclamo: { type: Schema.Types.ObjectId, ref: 'Reclamo', required: [true, 'Requiere idCliente'] },
    idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: [true, 'Requiere idProducto'] },
    repuesto: {type: String, required: [true, 'Requiere repuesto'] },
    observacion: {type: String, required: [true, 'Requiere observacion'] },
    fechaArchivado: {type: Date, default: null }
}, { versionKey: false });

module.exports = mongoose.model('Repuesto', RepuestoSchema);