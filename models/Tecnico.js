var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseSequence = require('mongoose-sequence')(mongoose);

var TecnicoSchema = new Schema ({
    idUser: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'Requiere idUser'] },
    legajo: { type: Number },
    dni: { type: Number, required: [true, 'Requiere dni'] },
    telefono: { type: Number, required: [true, 'Requiere telefono'] },
    localidad: { type: String, required: [true, 'Requiere localidad'] },
    provincia: { type: String, required: [true, 'Requiere provincia'] },
    direccion: { type: String, required: [true, 'Requiere direccion'] },
    cbu: { type: Number, required: [true, 'Requiere cbu'] },
    serviceNombre: { type: String, required: [true, 'Requiere serviceNombre'] },
    horarioDesde: {type: Date, required: [true, 'Requiere horarioDesde']},
    horarioHasta: {type: Date, required: [true, 'Requiere horarioHasta']},
    fechaArchivado: {type: Date, default: null}
}, {versionKey: false});

TecnicoSchema.plugin(mongooseSequence, {inc_field: 'legajo'});

module.exports = mongoose.model('Tecnico', TecnicoSchema);