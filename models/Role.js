const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
      name: String,
    }, {versionKey: false});

module.exports = mongoose.model('Role', RoleSchema);