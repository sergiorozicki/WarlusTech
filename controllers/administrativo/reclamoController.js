const Reclamo = require('../../models/Reclamo');
const Role = require('../../models/Role');
const Persona = require('../../models/Persona');
const Estado = require('../../models/Estado');
const Producto = require('../../models/Producto');
const autoIncrementController = require('../../autoIncrement/autoIncrement.controller');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const comprobarSiExisteDirectorio = () => {
    return new Promise((resolve, rejects) => {
        if(!fs.existsSync(path.join(__dirname,'../../files/reclamos/'))){
            fs.mkdir(path.join(__dirname,'../../files/reclamos/'), (error) => {
                if (error) rejects({ title: 'Error creando directorio.', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            });
        }
        resolve();
    });
}

const writeImage = async (destino, base64Data) => {
    return new Promise((resolve, rejects) => {
        fs.writeFileSync(destino, base64Data,  {encoding: 'base64'}, (error) => {
            if (error) { console.log(error); rejects({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
        });
        resolve();
    });
}

const insImagenReclamo = async (req, res) => {
    try {
        await comprobarSiExisteDirectorio();
        var today = new Date();
        var year = today.getFullYear(), month = parseInt(today.getMonth() + 1), date = today.getDate(), hours = today.getHours(), minutes = today.getMinutes(), seconds = today.getSeconds();
        if(month < 10) month = '0' + month;
        if(date < 10) date = '0' + date;
        if(hours < 10) hours = '0' + hours;
        if(minutes < 10) minutes = '0' + minutes;
        if(seconds < 10) seconds = '0' + seconds;
        var destino = path.join(__dirname,'../../files/reclamos/') + year + '' + month + '' + date + '' + hours + '' + minutes + '' + seconds + '_' + req.body.idReclamo + '_' + 'ticket.jpg';
        var imageData = req.body.fotoTicket;
        var base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        await writeImage(destino, base64Data);
        destino = path.join(__dirname,'../../files/reclamos/') + year + '' + month + '' + date + '' + hours + '' + minutes + '' + seconds + '_' + req.body.idReclamo + '_' + 'equipo.jpg';
        imageData = req.body.fotoEquipo;
        base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        await writeImage(destino, base64Data);
        return res.status(200).send({ title: '¡Excelente!', text: '¡Reclamo realizado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

const updImagenReclamo = async (req, res) => {
    try {
        await comprobarSiExisteDirectorio();
        fs.readdir(path.join(__dirname, '../../files/reclamos'), async (error, archivos) => {
            if(error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
            
            var today = new Date();
            var year = today.getFullYear(), month = parseInt(today.getMonth() + 1), date = today.getDate(), hours = today.getHours(), minutes = today.getMinutes(), seconds = today.getSeconds();
            if(month < 10) month = '0' + month;
            if(date < 10) date = '0' + date;
            if(hours < 10) hours = '0' + hours;
            if(minutes < 10) minutes = '0' + minutes;
            if(seconds < 10) seconds = '0' + seconds;

            if(req.body.fotoTicket != '') {
                var archivoSplit = '';
                for (var i of archivos) {
                    archivoSplit = i.split('_');
                    if(archivoSplit[1] == req.body.idReclamo && archivoSplit[2].split('.')[0] == 'ticket') fs.unlink(path.join(__dirname, '../../files/reclamos', i), (error, data) => {
                        if(error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
                    });
                }

                var destino = path.join(__dirname,'../../files/reclamos/') + year + '' + month + '' + date + '' + hours + '' + minutes + '' + seconds + '_' + req.body.idReclamo + '_' + 'ticket.jpg';
                var imageData = req.body.fotoTicket;
                var base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                await writeImage(destino, base64Data);
            }
    
            if(req.body.fotoEquipo != '') {
                var archivoSplit = '';
                for (var i of archivos) {
                    archivoSplit = i.split('_');
                    if(archivoSplit[1] == req.body.idReclamo && archivoSplit[2].split('.')[0] == 'equipo') fs.unlink(path.join(__dirname, '../../files/reclamos', i), (error, data) => {
                        if(error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
                    });
                }

                var destino = path.join(__dirname,'../../files/reclamos/') + year + '' + month + '' + date + '' + hours + '' + minutes + '' + seconds + '_' + req.body.idReclamo + '_' + 'equipo.jpg';
                var imageData = req.body.fotoEquipo;
                var base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                await writeImage(destino, base64Data);
            }
            return res.status(200).send({ title: '¡Excelente!', text: '¡Reclamo modificado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });
        });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getReclamoEnEspera = async (req, res) => {
    try {
        const estadoSearch = await Estado.find({ name: { $in: ['En espera']}});
        if(estadoSearch.length == 0) return res.status(401).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        
        const searchReclamoEnEspera = await Reclamo.aggregate([
            { $project: { idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1, seguimiento: { $slice: [ "$seguimiento", -1 ]}}},
            { $project: { seguimiento: {
                        $filter: {
                            input: "$seguimiento", 
                            as: "i", 
                            cond: { $or: estadoSearch.map((estado) => ({ $eq: ["$$i.idEstado", mongoose.Types.ObjectId( estado._id )]}))}
                        }
                    },
                    idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1
                }
            },
            { $match : { seguimiento: { $ne: []}}},
            { $lookup: { from: 'personas', localField: 'idCliente', foreignField: '_id', as: 'idCliente' }},
            { $lookup: { from: 'productos', localField: 'idProducto', foreignField: '_id', as: 'idProducto' }},
            { $lookup: { from: 'estados', localField: 'seguimiento.idEstado', foreignField: '_id', as: 'idEstado' }},
            { $lookup: { from: 'personas', localField: 'idTecnico', foreignField: '_id', as: 'idTecnico' }},
            { $sort : { numeroOrden : -1 }}
        ]);
        return res.status(200).send({ data: searchReclamoEnEspera, session: true, user: req.userName});

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getReclamoAceptado = async (req, res) => {
    try {
        const estadoSearch = await Estado.find({ name: { $in: ['En el taller', 'Aceptado', 'En espera de repuesto', 'Cambio del producto']}});
        if(estadoSearch.length == 0) return res.status(401).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        
        const searchReclamoAceptado = await Reclamo.aggregate([
            { $project: { idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1, seguimiento: { $slice: [ "$seguimiento", -1 ]}}},
            { $project: { seguimiento: {
                        $filter: {
                            input: "$seguimiento", 
                            as: "i", 
                            cond: { $or: estadoSearch.map((estado) => ({ $eq: ["$$i.idEstado", mongoose.Types.ObjectId( estado._id )]}))}
                        }
                    },
                    idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1
                }
            },
            { $match : { seguimiento: { $ne: [] }}},
            { $lookup: { from: 'personas', localField: 'idCliente', foreignField: '_id', as: 'idCliente' }},
            { $lookup: { from: 'productos', localField: 'idProducto', foreignField: '_id', as: 'idProducto' }},
            { $lookup: { from: 'estados', localField: 'seguimiento.idEstado', foreignField: '_id', as: 'idEstado' }},
            { $lookup: { from: 'personas', localField: 'idTecnico', foreignField: '_id', as: 'idTecnico' }},
            { $sort : { numeroOrden : -1 }}
        ]);
        return res.status(200).send({ data: searchReclamoAceptado, session: true, user: req.userName});

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getReclamoArchivado = async (req, res) => {
    try {
        const estadoSearch = await Estado.find({ name: { $in: ['Archivado']}});
        if(estadoSearch.length == 0) return res.status(401).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        
        const searchReclamoArchivado = await Reclamo.aggregate([
            { $project: { idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1, seguimiento: { $slice: [ "$seguimiento", -1 ]}}},
            { $project: { seguimiento: {
                        $filter: {
                            input: "$seguimiento", 
                            as: "i", 
                            cond: { $or: estadoSearch.map((estado) => ({ $eq: ["$$i.idEstado", mongoose.Types.ObjectId( estado._id )]}))}
                        }
                    },
                    idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1
                }
            },
            { $match : { seguimiento: { $ne :[] }}},
            { $lookup: { from: 'personas', localField: 'idCliente', foreignField: '_id', as: 'idCliente' }},
            { $lookup: { from: 'productos', localField: 'idProducto', foreignField: '_id', as: 'idProducto' }},
            { $lookup: { from: 'estados', localField: 'seguimiento.idEstado', foreignField: '_id', as: 'idEstado' }},
            { $lookup: { from: 'personas', localField: 'idTecnico', foreignField: '_id', as: 'idTecnico' }},
            { $sort : { numeroOrden : -1 }}
        ]);
        return res.status(200).send({ data: searchReclamoArchivado, session: true, user: req.userName});

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.insOrUpdCliente = async (req, res) => {
    try {
        const { nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal, accion } = req.body;
        if(!nombre || !apellido || !dni || !telefono || !email || !direccion || !localidad || !codigoPostal)
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const roleSearch = await Role.findOne({ name: 'CLIENTE' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const query = { idRole: roleSearch._id, dni },
        update = { idRole: roleSearch._id, nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const insUpdCliente = await Persona.findOneAndUpdate(query, update, options);
        if(!insUpdCliente) return res.status(400).send({ title: 'Error', text: 'Error al guardar o modificar el cliente', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        req.body.idCliente = insUpdCliente._id;
        switch (accion) {
            case 'insReclamo':
                insReclamo(req, res);
                break;
            case 'updReclamo':
                updReclamo(req, res);
                break;
            case 'aceptarReclamo':
                aceptarReclamo(req, res);
                break;
            default:
                return res.status(400).send({ title: 'Advertencia', text: 'No se encontró una función a ejecutar.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        }

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

const insReclamo = async (req, res) => {
    try {
        const { idCliente, idProducto, idModelo, falla } = req.body;
        var { idTecnico, seguimiento } = req.body;
        if(!idCliente || !idProducto || !idModelo || !falla )
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos del reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const estadoSearch = await Estado.findOne({ name: 'En espera' });
        if(!estadoSearch) return res.status(400).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        seguimiento = !seguimiento ? { idEstado: estadoSearch._id } : seguimiento;
        idTecnico = !idTecnico ? undefined : idTecnico;
        Object.assign(seguimiento, { fecha: Date.now() })

        const incrementNumeroOrden = await autoIncrementController.incrementDocument('numeroOrdenReclamo');
        if(incrementNumeroOrden.status == 400) return res.status(400).send({ title: 'Error', text: incrementNumeroOrden.msg, icon: 'warning', showConfirmButton: true, timer: false, session: true });
        const numeroOrden = incrementNumeroOrden.msg;

        const addReclamo = await new Reclamo({ idCliente, idProducto, idModelo, falla, idTecnico, seguimiento, numeroOrden }).save();
        if (!addReclamo) return res.status(400).send({ title: 'Error', text: 'Error al guardar el reclamo', icon: 'error', showConfirmButton: true, timer: false, session: true });
        req.body.idReclamo = addReclamo._id;
        insImagenReclamo(req, res);
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

const updReclamo = async (req, res) => {
    try {
        const { _id, idCliente, idProducto, idModelo, falla } = req.body;
        var { idTecnico, seguimiento } = req.body;
        let updReclamo;
        if(!_id || !idCliente || !idProducto || !idModelo || !falla || !seguimiento )
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos del reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const estadoSearch = await Estado.findOne({ _id: seguimiento.idEstado });
        if(!estadoSearch) return res.status(400).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const seguimientoReclamo = await Reclamo.aggregate([ { $project: { seguimiento: { $slice: [ "$seguimiento", -1 ] } } }, { $match : { _id: mongoose.Types.ObjectId(_id) } } ]);
        if(seguimientoReclamo.length == 0) return res.status(400).send({ title: 'Advertencia', text: 'No se encontró el estado en seguimiento.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        idTecnico = idTecnico == '' ? undefined : idTecnico;
        Object.assign(seguimiento, { fecha: Date.now() });

        if(seguimientoReclamo[0].seguimiento[0].idEstado.toString().replace(/ObjectId\("(.*)"\)/, "$1") == seguimiento.idEstado) {
            updReclamo = await Reclamo.findByIdAndUpdate(_id, { idCliente, idTecnico, idProducto, idModelo, falla });
            if(!updReclamo) return res.status(401).send({ title: 'Error', text: 'Error al modificar reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        } else {
            updReclamo = await Reclamo.findByIdAndUpdate(_id, { idCliente, idTecnico, idProducto, idModelo, falla, $addToSet: { seguimiento } });
            if(!updReclamo) return res.status(401).send({ title: 'Error', text: 'Error al modificar reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        }

        req.body.idReclamo = updReclamo._id;
        updImagenReclamo(req, res);
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

const aceptarReclamo = async (req, res) => {
    try {
        const { _id, idCliente, idProducto, idModelo, falla, seguimiento } = req.body;
        var { idTecnico } = req.body;

        if(!_id || !idCliente || !idProducto || !idModelo || !falla )
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos de reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const estadoSearch = await Estado.findById( seguimiento.idEstado );
        if(!estadoSearch) return res.status(400).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'error', showConfirmButton: true, timer: false, session: true });
        Object.assign(seguimiento, { fecha: Date.now() });

        idTecnico = idTecnico == '' ? undefined : idTecnico;
        const aceptarReclamo = await Reclamo.findByIdAndUpdate(_id, { idCliente, idTecnico, idProducto, idModelo, falla, $addToSet: { seguimiento }});
        if(!aceptarReclamo) return res.status(401).send({ title: 'Error', text: 'Error al aceptar reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelente!', text: '¡Reclamo aceptado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.delReclamo = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos del reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const delReclamo = await Reclamo.findByIdAndDelete(_id);
        if(!delReclamo) return res.status(400).send({ title: 'Error', text: 'Error al eliminar el reclamo', icon: 'error', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelente!', text: '¡Reclamo eliminado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.asignarTecnico = async (req, res) => {
    try {
        const { _id, idTecnico } = req.body;
        if(!_id || !idTecnico) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const tecnicoSearch = await Persona.findOne({ _id: idTecnico });
        if(!tecnicoSearch) return res.status(400).send({ title: 'Advertencia', text: 'No se encontró el técnico.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const addTecnicoEnReclamo = await Reclamo.findByIdAndUpdate(_id, { idTecnico });
        if(!addTecnicoEnReclamo) return res.status(400).send({ title: 'Error', text: 'Error al agregar el técnico', icon: 'error', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelente!', text: '¡Técnico asignado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.archivarReclamo = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos de reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const estadoSearch = await Estado.findOne({ name: { $in : ['Archivado'] } });
        if(!estadoSearch) return res.status(400).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'error', showConfirmButton: true, timer: false, session: true });
        const seguimiento = { idEstado: estadoSearch._id, fecha: Date.now() };

        const addSeguimiento = await Reclamo.findByIdAndUpdate(_id, { $addToSet: { seguimiento } });
        if(!addSeguimiento) return res.status(400).send({ title: 'Error', text: 'Error al agregar seguimiento', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelente!', text: '¡Reclamo archivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.desarchivarReclamo = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos de reclamo.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const searchReclamoArchivado = await Reclamo.findById( _id , { seguimiento: { $slice: [ "$seguimiento", -2 ]}});
        const seguimiento = { idEstado: searchReclamoArchivado.seguimiento[0].idEstado, fecha: Date.now() };

        const addSeguimiento = await Reclamo.findByIdAndUpdate(_id, { $addToSet: { seguimiento }});
        if(!addSeguimiento) return res.status(400).send({ title: 'Error', text: 'Error al desarchivar reclamo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelente!', text: '¡Reclamo desarchivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getTecnico = async (req, res) => {
    try {
        const roleSearch = await Role.findOne({ name: 'TECNICO' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const tecnicoSearch = await Persona.find({ fechaArchivado: null, idRole: roleSearch._id });
        return res.status(200).send({ data: tecnicoSearch, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getProducto = async (req, res) => {
    try {
        const productoSearch = await Producto.find({ fechaArchivado: null });
        return res.status(200).send({ data: productoSearch, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getEstado = async (req, res) => {
    try {
        const estadoSearch = await Estado.find();
        return res.status(200).send({ data: estadoSearch, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getCliente = async (req, res) => {
    try {
        const { dni } = req.body;

        const roleSearch = await Role.findOne({ name: 'CLIENTE' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const clienteSearch = await Persona.find({ dni, idRole: roleSearch._id });
        return res.status(200).send({ data: clienteSearch, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getSeguimientoPorDni = async (req, res) => {
    try {
        const { numeroOrden, dni } = req.body;
        if(!numeroOrden || !dni ) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const roleSearch = await Role.findOne({ name: 'CLIENTE' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const clienteSearch = await Persona.findOne({ dni, idRole: roleSearch._id });
        if(!clienteSearch) return res.status(400).send({ title: '¡Ups!', text: `No se encontró una persona con el DNI ${dni}.`, icon: 'info', showConfirmButton: true, timer: false, session: true });
       
        const seguimientoReclamo = await Reclamo.find({ idCliente: clienteSearch._id, numeroOrden }, {seguimiento: 1}).populate('seguimiento.idEstado')
        if(seguimientoReclamo.length == 0) return res.status(401).send({ title: '¡Ups!', text: 'No se encontró seguimiento para el reclamo.', icon: 'info', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ data: seguimientoReclamo, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getSeguimientoPorId = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id ) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const seguimientoReclamo = await Reclamo.findById({ _id }, { seguimiento: 1 }).populate('seguimiento.idEstado')
        if(seguimientoReclamo.length == 0) return res.status(400).send({ title: '¡Ups!', text: 'No se encontró seguimiento para el reclamo.', icon: 'info', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ data: seguimientoReclamo, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getFoto = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        
        const searchReclamo = await Reclamo.findById(_id);
        if(!searchReclamo) return res.status(400).send({ title: 'Error', text: 'Error al buscar reclamo', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        fs.readdir(path.join(__dirname,'../../files/reclamos'), async (error, archivos) => {
            if(error) return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            var archivoSplit = '', fotos = {};
            for (var i = 0; i < archivos.length; i++) {
                archivoSplit = archivos[i].split('_');
                if(archivoSplit[1] == _id && archivoSplit[2].split('.')[0] == 'ticket') Object.assign(fotos, { fotoTicket: fs.readFileSync(path.join(__dirname,'../../files/reclamos/', archivos[i]), 'base64')});
                if(archivoSplit[1] == _id && archivoSplit[2].split('.')[0] == 'equipo') Object.assign(fotos, { fotoEquipo: fs.readFileSync(path.join(__dirname,'../../files/reclamos/', archivos[i]), 'base64')});
            }
            return res.status(200).send({ data: fotos, session: true, user: req.userName });
        })

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.downloadFoto = async (req, res) => {
    try {
        const { idReclamo } = req.query;
        if(!idReclamo) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        fs.readdir(path.join(__dirname, '../../files/reclamos'), async (error, archivos) => {
            if(error) return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            var foto = '';

            for (var i of archivos) {
                archivoSplit = i.split('_');
                if(archivoSplit[1] == idReclamo && archivoSplit[2].split('.')[0] == req.query.tipo)
                foto = i;
            }

            return res.download(path.join(__dirname,'../../files/reclamos/' + foto), (error) => {
                if(error) return res.status(500).send({ title: 'Error descargando foto.', text: error.toString(), icon: 'info', showConfirmButton: true, timer: false, session: true });
            });
        });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}