const AutoIncrement = require('./autoIncrement.model');

exports.incrementDocument = async (ref) => {
    try {
        const searchAutoIncrement = await AutoIncrement.findOne({ ref });
        if(!searchAutoIncrement) return { status: 400,  msg: `Referencia de AutoIncrement ${ref} no encontrado` };
        const seq = searchAutoIncrement.seq + 1;
        const autoIncrement = await AutoIncrement.findByIdAndUpdate(searchAutoIncrement._id, { seq });
        if(!autoIncrement) return { status: 400,  msg: 'Error al incrementar' };
        const searchAutoIncrement2 = await AutoIncrement.findOne({ ref });
        return { status: 200,  msg: searchAutoIncrement2.seq };
    } catch (e) { return { status: 500,  msg: 'Error, contacte al administrador' + e }; }
}

exports.newAutoIncrement = async (ref) => {
    try {
        const newAutoIncrement = await new AutoIncrement({ ref, seq: 0 }).save();
        if(!newAutoIncrement) return { status: 400,  msg: 'Error al crear AutoIncrement' }
        return { status: 200,  msg: `AutoIncrement ${ref} creado correctamente` };
    } catch (e) { return { status: 500,  msg: 'Error, contacte al administrador' + e }; }
}