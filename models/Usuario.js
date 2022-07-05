var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema ({
    idRole: { type: Schema.Types.ObjectId, ref: 'Role', required: [true, 'Requiere idRole'] },
    nombre: { type: String, required: [true, 'Requiere nombre'] },
    apellido: { type: String, required: [true, 'Requiere apellido'] },
    email: { type: String, unique: true, required: [true, 'Requiere email'] },
    user: { type: String, unique: true, required: [true, 'Requiere user'] },
    password: { type: String, required: [true, 'Requiere password'] },
    fechaArchivado: {type: Date, default: null}
}, {versionKey: false, timestamps: true});

UsuarioSchema.statics.encryptPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

UsuarioSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcryptjs.compare(password, receivedPassword);
}

module.exports = mongoose.model('Usuario', UsuarioSchema);