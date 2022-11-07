const Repuesto = require('../../models/Repuesto');
const Reclamo = require('../../models/Reclamo');
const fs = require('fs');
const path = require('path');

exports.getRepuesto = async (req, res) => {
    try {
        const searchRepuesto = await Repuesto.find({ fechaArchivado: null }).sort({ createdAt: -1 })
        .populate({path: 'idReclamo', populate: [{ path: 'idCliente' }, { path: 'idProducto' }]})
        .populate({path: 'idTecnico'});
        return res.status(200).send({ data: searchRepuesto, session: true, user: req.userName, idTecnico: req.idTecnico });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getRepuestoArchivado = async (req, res) => {
    try {
        const searchRepuesto = await Repuesto.find({ fechaArchivado: { $ne: null }}).sort({ createdAt: -1 })
        .populate({path: 'idReclamo', populate: [{ path: 'idCliente' }, { path: 'idProducto' }]})
        .populate({path: 'idTecnico'});
        return res.status(200).send({ data: searchRepuesto, session: true, user: req.userName, idTecnico: req.idTecnico });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.insRepuesto = async (req, res) => {
    try {
        const { idTecnico, idReclamo, observacion } = req.body;
        if(!idTecnico || !idReclamo || !observacion)
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const insRepuesto = await new Repuesto({ idTecnico, idReclamo, observacion }).save();
        if (!insRepuesto) return res.status(401).send({ title: 'Error', text: 'Error guardando repuesto.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelente!', text: '¡Solicitud de repuesto registrada correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); } 
}

exports.getReclamo = async (req, res) => {
    try {
        const searchReclamo = await Reclamo.find({ idTecnico: req.idTecnico });
        return res.status(200).send({ data: searchReclamo, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.archivarRepuesto = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const archivarRepuesto = await Repuesto.findByIdAndUpdate(_id, { fechaArchivado: new Date() });
        if(!archivarRepuesto) return res.status(401).send({ title: 'Error', text: 'Error archivando repuesto.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Repuesto archivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.desarchivarRepuesto = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const desarchivarRepuesto = await Repuesto.findByIdAndUpdate( _id, { $unset: { fechaArchivado: -1 }});
        if(!desarchivarRepuesto) return res.status(401).send({ title: 'Error', text: 'Error desarchivando repuesto.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Repuesto desarchivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getFoto = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        
        const searchRepuesto = await Repuesto.findById(_id);
        if(!searchRepuesto) return res.status(400).send({ title: 'Error', text: 'Error al buscar repuesto', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        fs.readdir(path.join(__dirname,'../../files/repuestos'), async (error, archivos) => {
            if(error) return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            var archivoSplit = '', fotos = {};
            for (var i = 0; i < archivos.length; i++) {
                archivoSplit = archivos[i].split('.');
                if(archivoSplit[0] == _id) Object.assign(fotos, { fotoRepuesto: fs.readFileSync(path.join(__dirname,'../../files/repuestos/', archivos[i]), 'base64')});
            }
            return res.status(200).send({ data: fotos, session: true, user: req.userName });
        })

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.downloadFoto = async (req, res) => {
    try {
        const { _id } = req.query;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        fs.readdir(path.join(__dirname, '../../files/repuestos'), async (error, archivos) => {
            if(error) return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            var foto = '';

            for (var i of archivos) {
                archivoSplit = i.split('.');
                if(archivoSplit[0] == _id) foto = i;
            }

            return res.download(path.join(__dirname,'../../files/repuestos/' + foto), (error) => {
                if(error) return res.status(500).send({ title: 'Error descargando foto.', text: error.toString(), icon: 'info', showConfirmButton: true, timer: false, session: true });
            });
        });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}