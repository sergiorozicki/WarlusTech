var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseSequence = require('mongoose-sequence')(mongoose);

var ReclamoSchema = new Schema ({
    numeroOrden: Number,
    idCliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: [true, 'Requiere idCliente'] },
    idTecnico: { type: Schema.Types.ObjectId, ref: 'Tecnico', default: null },
    idEstado: { type: Schema.Types.ObjectId, ref: 'Cliente', default: '62b63438455b05f5dc174259' },
    marca: { type: String, required: [true, 'Requiere marca'] },
    modelo: { type: String, required: [true, 'Requiere modelo'] },
    numeroSerie: { type: String, required: [true, 'Requiere numeroSerie'] },
    falla: { type: String, required: [true, 'Requiere falla'] },
    observacion: { type: String, required: [true, 'Requiere observacion'] }
}, {versionKey: false});

ReclamoSchema.plugin(mongooseSequence, {inc_field: 'numeroOrden'});

module.exports = mongoose.model('Reclamo', ReclamoSchema);