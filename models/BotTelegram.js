const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotTelegram = new Schema({
  userId: Number,
  ultimaAccion: String,
  dni: Number,
  numeroOrden: Number,
}, {versionKey: false, collection: 'botTelegram'});

module.exports = mongoose.model('BotTelegram', BotTelegram);