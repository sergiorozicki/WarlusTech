const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const mongooseSequence = require('mongoose-sequence')(mongoose);

const ReclamoSchema = new Schema ({
    numeroOrden: Number,
    idCliente: { type: Schema.Types.ObjectId, ref: 'Persona', required: [true, 'Requiere idCliente'] },
    idTecnico: { type: Schema.Types.ObjectId, ref: 'Persona', },
    idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: [true, 'Requiere idProducto'] },
    idModelo: { type: Schema.Types.ObjectId, ref: 'Producto.modelo.col', required: [true, 'Requiere idModelo'] },
    falla: { type: String, required: [true, 'Requiere falla'] },
    seguimiento: { type: [{idEstado: {type: Schema.Types.ObjectId, ref: 'Estado'}, fecha: Date}], default: [{idEstado: '62c2cb567d6123a3ec2f26b0', fecha: Date.now()}] }
}, {versionKey: false});

//ReclamoSchema.plugin(mongooseSequence, {inc_field: 'numeroOrden'});
module.exports = mongoose.model('Reclamo', ReclamoSchema);