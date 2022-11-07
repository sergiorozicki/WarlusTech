const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const AutoIncrementSchema = new Schema({
    ref: {type: String, unique: true},
    seq: Number
}, {
    collection: 'autoIncrement',
    versionKey: false
});

AutoIncrementSchema.plugin(uniqueValidator);
module.exports = mongoose.model('AutoIncrement', AutoIncrementSchema);