const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const PersonaSchema = new Schema ({
    idRole: {type: Schema.Types.ObjectId, ref: 'Role'},
    apellido: {type: String, required: [true, 'Requiere apellido']},
    nombre: {type: String, required: [true, 'Requiere nombre']},
    dni: {type: Number, required: [true, 'Requiere dni']},
    telefono: {type: Number, required: [true, 'Requiere telefono']},
    email: {type: String, unique: true, required: [true, 'Requiere email']},
    direccion: {type: String, required: [true, 'Requiere direccion']},
    codigoPostal: {type: String, required: [true, 'Requiere codigoPostal']},
	provincia: String,
    localidad: String,
	cbu: String,
	nombreServicio: String,
	horarioDesde: String,
	horarioHasta: String,
	user: {type: String, unique: true, sparse: true},
	password: String,
    legajo: Number,
    fechaArchivado: Date
}, {versionKey: false});

PersonaSchema.statics.encryptPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}
  
PersonaSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcryptjs.compare(password, receivedPassword);
}

PersonaSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Persona', PersonaSchema);