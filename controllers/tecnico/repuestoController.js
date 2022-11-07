const Repuesto = require('../../models/Repuesto');
const Reclamo = require('../../models/Reclamo');
const fs = require('fs');
const path = require('path');

exports.getRepuesto = async (req, res) => {
    try {
        const searchRepuesto = await Repuesto.find({ idTecnico: req.idTecnico, fechaArchivado: null }).populate({ path: 'idReclamo', populate: [{ path: 'idCliente' }, { path: 'idProducto' }]});
        return res.status(200).send({ data: searchRepuesto, session: true, user: req.userName, idTecnico: req.idTecnico });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getRepuestoArchivado = async (req, res) => {
    try {
        const searchRepuesto = await Repuesto.find({ idTecnico: req.idTecnico, fechaArchivado: { $ne: null }}).populate({ path: 'idReclamo', populate: [{ path: 'idCliente' }, { path: 'idProducto' }]});
        return res.status(200).send({ data: searchRepuesto, session: true, user: req.userName, idTecnico: req.idTecnico });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.insRepuesto = async (req, res) => {
    try {
        const { idTecnico, idReclamo, repuesto, observacion } = req.body;
        if(!idTecnico || !idReclamo || !repuesto || !observacion) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false });

        const addRepuesto = await new Repuesto({ idTecnico, idReclamo, repuesto, observacion }).save();
        if (!addRepuesto) return res.status(401).send({ title: 'Error', text: 'Error guardando repuesto.', icon: 'warning', showConfirmButton: true, timer: false });
        
        req.body.idRepuesto = addRepuesto._id;
        insImagenReclamo(req, res);

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false }); }
}

exports.getReclamo = async (req, res) => {
    try {
        const searchReclamo = await Reclamo.find({ idTecnico: req.idTecnico }).populate({ path: 'idProducto' });
        return res.status(200).send({ data: searchReclamo, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false }); }
}

const comprobarSiExisteDirectorio = () => {
    return new Promise((resolve, rejects) => {
        if(!fs.existsSync(path.join(__dirname,'../../files/repuestos/')))
            fs.mkdir(path.join(__dirname,'../../files/repuestos/'), (error) => {
                if (error) rejects({ title: 'Error creando directorio.', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false });
            });
        resolve();
    });
}

const writeImage = (destino, base64Data) => {
    return new Promise((resolve, rejects) => {
        fs.writeFileSync(destino, base64Data,  {encoding: 'base64'}, (error) => {
            if (error) rejects({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false });
        });
        resolve();
    });
}

const insImagenReclamo = async (req, res) => {
    try {
        await comprobarSiExisteDirectorio();
        destino = path.join(__dirname,'../../files/repuestos/') + req.body.idRepuesto + ".jpg";
        imageData = req.body.fotoRepuesto;
        base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        await writeImage(destino, base64Data);
        return res.status(200).send({ title: '¡Excelente!', text: '¡Solicitud de repuesto registrada correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false }); }
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