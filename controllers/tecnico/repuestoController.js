var Cliente = require('../../models/Cliente');
var Producto = require('../../models/Producto');
var Repuesto = require('../../models/Repuesto');
var Reclamo = require('../../models/Reclamo');
var fs = require('fs');
var path = require('path');

exports.getRepuesto = async (req, res) => {
    try {
        Repuesto.find({ idTecnico: req.idTecnico, fechaArchivado: null }, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los repuestos solicitados',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName, idTecnico: req.idTecnico});
        }).sort({createdAt: -1}).populate({path: 'idReclamo',
        populate: {
            path: 'idCliente'
        }
    }).populate('idProducto');
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'error',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.getRepuestoArchivado = async (req, res) => {
    try {
        Repuesto.find({ idTecnico: req.idTecnico, fechaArchivado: { $ne: null } }, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los repuestos archivados',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName, idTecnico: req.idTecnico});
        }).sort({createdAt: -1}).populate({path: 'idReclamo',
        populate: {
            path: 'idCliente'
        }
    }).populate('idProducto');
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'error',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.insRepuesto = async (req, res) => {
    try {
        var { idTecnico, idReclamo, idProducto, repuesto, observacion } = req.body;
        if(!idTecnico || !idReclamo || !observacion)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            var repuesto = await new Repuesto({
                idTecnico, idReclamo, idProducto, repuesto, observacion
            });

            await repuesto.save((error, result) => {
                if (error)
                    return res.status(500).send({
                        title: 'Error',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                req.body.idRepuesto = result._id;
                insImagenReclamo(req, res);
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'error',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }   
}

exports.getCliente = async (req, res) => {
    try {
        var { dni } = req.body;
        Cliente.find({dni}, (error, data) => {
            if(error)
                return res.status(500).send({
                    title: 'Error mostrando los clientes',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            return res.status(200).send({data: data, session: true});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'error',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.getReclamo = async (req, res) => {
    try {
        Reclamo.find({ idTecnico: req.idTecnico }, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los reclamos',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'error',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.getProducto = async (req, res) => {
    try {
        Producto.find({ fechaArchivado: null }, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los productos',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName, idTecnico: req.idTecnico});
        }).sort({createdAt: -1})
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'error',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

var comprobarSiExisteDirectorio = () => {
    return new Promise((resolve, rejects) => {
        if(!fs.existsSync(path.join(__dirname,'../../files/repuestos/'))){
            fs.mkdir(path.join(__dirname,'../../files/repuestos/'), (error) => {
                if (error) {
                    rejects({
                        title: 'Error creando directorio.',
                        text: error,
                        icon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
            });
        }
        resolve();
    });
}

function writeImage(destino, base64Data){
    return new Promise((resolve, rejects) => {
        fs.writeFileSync(destino, base64Data,  {encoding: 'base64'}, (error) => {
            if (error) {
               rejects({
                    title: 'Error',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
        });
        resolve();
    });
}

var insImagenReclamo = async (req, res) => {
    try {
        await comprobarSiExisteDirectorio();
        destino = path.join(__dirname,'../../files/repuestos/') + req.body.idRepuesto + ".jpg";
        imageData = req.body.fotoRepuesto;
        base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        await writeImage(destino, base64Data);
        return res.status(200).send({
            title: '¡Excelente!',
            text: '¡Solicitud de repuesto registrada correctamente!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            session: true
        });
    } catch (error) {
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'error',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}