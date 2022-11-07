const Reclamo = require('../../models/Reclamo');
const Estado = require('../../models/Estado');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

exports.getEstado = async (req, res) => {
    try {
        const { numeroOrden, dni } = req.body;
        if(!numeroOrden || !dni ) res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const searchEstado = await Reclamo.find({ numeroOrden, dni });
        return res.status(200).send({ data: searchEstado, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getReclamo = async (req, res) => {
    try {
        const searchEstado = await Estado.find({ name: { $in : ['En el taller', 'Aceptado', 'En espera de repuesto', 'Cambio del producto']}});
        if(searchEstado.length == 0) return res.status(400).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        
        const searchReclamo = await Reclamo.aggregate([
            { $project: { idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1, seguimiento: { $slice: [ "$seguimiento", -1 ] } } },
            { $project: { seguimiento: {
                        $filter: {
                            input: "$seguimiento",
                            as: "i",
                            cond: { $or: searchEstado.map((estado) => ({ $eq: [ "$$i.idEstado", mongoose.Types.ObjectId( estado._id )]}))}
                        }
                    },
                    idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1
                }
            },
            { $match : { seguimiento: { $ne :[]}, idTecnico: { $ne: req.idTecnico }}},
            { $lookup: { from: 'personas', localField: 'idCliente', foreignField: '_id', as: 'idCliente' }},
            { $lookup: { from: 'productos', localField: 'idProducto', foreignField: '_id', as: 'idProducto' }},
            { $lookup: { from: 'estados', localField: 'seguimiento.idEstado', foreignField: '_id', as: 'idEstado' }},
            { $sort : { numeroOrden: -1 }}
        ]);
        return res.status(200).send({ data: searchReclamo, session: true, user: req.userName });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getReclamoArchivado = async (req, res) => {
    try {
        const searchEstado = await Estado.find({ name: { $in: ['Archivado']}});
        if(searchEstado.length == 0) return res.status(400).send({ title: 'Advertencia', text: 'No se encontró el estado.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        
        const searchReclamo = await Reclamo.aggregate([
            { $project: { idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1, seguimiento: { $slice: [ "$seguimiento", -1 ]}}},
            { $project: { seguimiento: {
                        $filter: {
                            input: "$seguimiento",
                            as: "i",
                            cond: { $or: searchEstado.map((estado) => ({ $eq: [ "$$i.idEstado", mongoose.Types.ObjectId( estado._id )]}))}
                        }
                    },
                    idCliente: 1, idTecnico: 1, idProducto: 1, idModelo: 1, falla: 1, numeroOrden: 1
                }
            },
            { $match : { seguimiento: { $ne :[] }, idTecnico: { $ne : req.idTecnico }}},
            { $lookup: { from: 'personas', localField: 'idCliente', foreignField: '_id', as: 'idCliente' }},
            { $lookup: { from: 'productos', localField: 'idProducto', foreignField: '_id', as: 'idProducto' }},
            { $lookup: { from: 'estados', localField: 'seguimiento.idEstado', foreignField: '_id', as: 'idEstado' }},
            { $sort : { numeroOrden: -1 }}
        ]);
        return res.status(200).send({ data: searchReclamo, session: true, user: req.userName });

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
                if(archivoSplit[1] == _id && archivoSplit[2].split('.')[0] == 'equipo') Object.assign(fotos, { fotoEquipo: fs.readFileSync(path.join(__dirname,'../../files/reclamos/', archivos[i]), 'base64')});
            }
            return res.status(200).send({ data: fotos, session: true, user: req.userName });
        })

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.downloadFoto = async (req, res) => {
    try {
        fs.readdir(path.join(__dirname, '../../files/reclamos'), async (error, archivos) => {
            if(error) return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            var foto = '';

            for (var i of archivos) {
                archivoSplit = i.split('_');
                if(archivoSplit[1] == req.query.idReclamo && archivoSplit[2].split('.')[0] == 'equipo')
                foto = i;
            }

            return res.download(path.join(__dirname,'../../files/reclamos/' + foto), (error) => {
                if(error) return res.status(500).send({ title: 'Error descargando foto.', text: error.toString(), icon: 'info', showConfirmButton: true, timer: false, session: true });
            });
        });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}