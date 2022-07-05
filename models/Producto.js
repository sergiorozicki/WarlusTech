var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = new Schema ({
    descripcion: {type: String, required: [true, 'Requiere descripcion']},
    marca: {type: String, required: [true, 'Requiere marca']},
    modelo: {type: String, required: [true, 'Requiere modelo']},
    numeroSerie: {type: String, required: [true, 'Requiere numeroSerie']},
    fechaArchivado: {type: Date, default: null}
}, {versionKey: false});

module.exports = mongoose.model('Producto', ProductoSchema);