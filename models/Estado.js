const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstadoSchema = new Schema({
      name: String,
    }, {versionKey: false});

module.exports = mongoose.model('Estado', EstadoSchema);