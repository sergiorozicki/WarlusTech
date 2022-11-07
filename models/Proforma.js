const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProformaSchema = new Schema ({
    idTecnico: { type: Schema.Types.ObjectId, ref: 'Persona', required: [true, 'Requiere idTecnico'] },
    idCliente: { type: Schema.Types.ObjectId, ref: 'Persona', required: [true, 'Requiere idCliente'] },
    idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: [true, 'Requiere idProducto'] },
    idModelo: { type: Schema.Types.ObjectId, required: [true, 'Requiere idModelo'] },
    observacion: {type: String, required: [true, 'Requiere observacion']}
}, {versionKey: false});

module.exports = mongoose.model('Proforma', ProformaSchema);