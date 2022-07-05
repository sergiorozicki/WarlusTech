var Cliente = require('../../models/Cliente');
var Producto = require('../../models/Producto');
var Repuesto = require('../../models/Repuesto');
var Reclamo = require('../../models/Reclamo');

exports.getRepuesto = async (req, res) => {
    try {
        Repuesto.find({ fechaArchivado: null }, (error, data) => {
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
        }).populate({path: 'idTecnico',
                        populate: {
                        path: 'idUser'
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
        Repuesto.find({ fechaArchivado: { $ne: null} }, (error, data) => {
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
        }).populate({path: 'idTecnico',
                        populate: {
                        path: 'idUser'
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
        var { idTecnico, idReclamo, observacion } = req.body;
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
                idTecnico, idReclamo, observacion
            });

            await repuesto.save((error, data) => {
                if (error)
                    return res.status(500).send({
                        title: 'Error',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                return res.status(200).send({
                    title: '¡Excelente!',
                    text: '¡Solicitud de repuesto registrada correctamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    session: true
                });
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

exports.insOrUpdCliente = async (req, res) => {
    try {
        var { nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal } = req.body;
        var query = {dni},
        update = { nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
        Cliente.findOneAndUpdate(query, update, options, (error, result) => {
            if (error) {
                return res.status(500).send({
                    title: 'Error',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            req.body.idCliente = result._id;
            if (req.body.functionBack == 'insProforma') insProforma(req, res);
            else updProforma(req, res);
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

var updProforma = async (req, res) => {
    try {
        var {_id, idTecnico, idCliente, idProducto, observacion } = req.body;
        if(!_id || !idTecnico || !idCliente || !idProducto || !observacion)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            Proforma.findByIdAndUpdate(_id, {
                idTecnico, idCliente, idProducto, observacion
            }, (error, result)=>{
                if(error){
                    return res.status(500).send({
                        title: 'Error',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
                return res.status(200).send({
                    title: '¡Excelente!',
                    text: '¡Proforma editado correctamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    session: true
                });
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

exports.archivarRepuesto = async (req, res) => {
    try {
        var { _id } = req.body;
        if(!_id)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            Repuesto.findByIdAndUpdate(_id, { fechaArchivado: new Date() }, (error, result)=>{
                if(error) return res.status(500).send({
                    title: 'Error archivando repuesto',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                return res.status(200).send({
                    title: '¡Excelenete!',
                    text: '¡Repuesto archivado correctamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    session: true
                });
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

exports.desarchivarRepuesto = async (req, res) => {
    try {
        var { _id } = req.body;
        if(!_id)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            Repuesto.findByIdAndUpdate(_id, { fechaArchivado: null }, (error, result)=>{
                if(error) return res.status(500).send({
                    title: 'Error desarchivando repuesto',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                return res.status(200).send({
                    title: '¡Excelenete!',
                    text: '¡Repuesto desarchivado correctamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    session: true
                });
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