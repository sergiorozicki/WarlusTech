const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ProductoSchema = new Schema ({
    marca: {type: String, unique: true, required: [true, 'Requiere marca']},
    descripcion: {type: String, required: [true, 'Requiere descripcion']},
    modelo: {type: [{nombre: String, fechaArchivado: Date}]},
    fechaArchivado: Date
}, {versionKey: false});

ProductoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Producto', ProductoSchema);