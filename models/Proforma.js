var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProformaSchema = new Schema ({
    idTecnico: { type: Schema.Types.ObjectId, ref: 'Tecnico', required: [true, 'Requiere idTecnico'] },
    idCliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: [true, 'Requiere idCliente'] },
    idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: [true, 'Requiere idProducto'] },
    observacion: {type: String, required: [true, 'Requiere observacion']}
}, {versionKey: false, timestamps: true});

module.exports = mongoose.model('Proforma', ProformaSchema);