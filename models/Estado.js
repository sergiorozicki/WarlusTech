var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstadoSchema = new Schema({
      name: String,
    }, {versionKey: false});

module.exports = mongoose.model('estado', EstadoSchema);