var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = new Schema ({
    nombre: {type: String, required: [true, 'Requiere nombre']},
    apellido: {type: String, required: [true, 'Requiere apellido']},
    dni: {type: Number, required: [true, 'Requiere dni']},
    telefono: {type: Number, required: [true, 'Requiere telefono']},
    email: {type: String, required: [true, 'Requiere email']},
    direccion: {type: String, required: [true, 'Requiere direccion']},
    localidad: {type: String, required: [true, 'Requiere localidad']},
    codigoPostal: {type: Number, required: [true, 'Requiere codigoPostal']}
}, {versionKey: false});

module.exports = mongoose.model('Cliente', ClienteSchema);