var Reclamo = require('../../models/Reclamo');
var Cliente = require('../../models/Cliente');
var Tecnico = require('../../models/Tecnico');

var fs = require('fs');
var path = require('path');

var comprobarSiExisteDirectorio = () => {
    return new Promise((resolve, rejects) => {
        if(!fs.existsSync(path.join(__dirname,'../../files/reclamos/'))){
            fs.mkdir(path.join(__dirname,'../../files/reclamos/'), (error) => {
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
        var today = new Date();
        var year = today.getFullYear(), month = parseInt(today.getMonth() + 1), date = today.getDate(), hours = today.getHours(), minutes = today.getMinutes(), seconds = today.getSeconds();
        if(month < 10) month = "0" + month;
        if(date < 10) date = "0" + date;
        if(hours < 10) hours = "0" + hours;
        if(minutes < 10) minutes = "0" + minutes;
        if(seconds < 10) seconds = "0" + seconds;
        var destino = path.join(__dirname,'../../files/reclamos/') + year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds + "_" + req.body.idReclamo + "_" + "ticket.jpg";
        var imageData = req.body.fotoTicket;
        var base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        await writeImage(destino, base64Data);
        destino = path.join(__dirname,'../../files/reclamos/') + year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds + "_" + req.body.idReclamo + "_" + "equipo.jpg";
        imageData = req.body.fotoEquipo;
        base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        await writeImage(destino, base64Data);
        return res.status(200).send({
            title: '¡Excelente!',
            text: '¡Reclamo realizado correctamente!',
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

exports.insCliente = async (req, res) => {
    try {
        var { nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal } = req.body;
        if(!nombre || !apellido || !dni || !telefono || !email || !direccion || !localidad || !codigoPostal)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            var cliente = await new Cliente({
                nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal
            });
        
            await cliente.save((error) => {
                if (error){
                    return res.status(500).send({
                        title: 'Error',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
                req.body.idCliente = result._id;
                insReclamo(req, res);
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'info',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.updCliente = async (req, res) => {
    try {
        var _id = req.body.idCliente;
        var { nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal } = req.body;
        if(!nombre || !apellido || !dni || !telefono || !email || !direccion || !localidad || !codigoPostal)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos del cliente.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            Cliente.findByIdAndUpdate(_id, {
                nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal
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
                req.body.idCliente = result._id;
                this.updReclamo(req, res);
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'info',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
    
}

exports.getReclamo = async (req, res) => {
    try {
        Reclamo.find({}, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los reclamos',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName});
        }).sort({numeroOrden: -1}).populate('idCliente').
            populate({path: 'idTecnico',
                populate: {
                    path: 'idUser',
                    select: ['-password', '-createdAt', '-updatedAt']
                }
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'info',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

var insReclamo = async (req, res) => {
    try {
        var { idCliente, tecnico, marca, modelo, numeroSerie, falla, observacion, estado } = req.body;
        if(!idCliente || !marca || !modelo || !numeroSerie || !falla || !observacion )
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            tecnico = tecnico == '' ? null : tecnico;
            console.log(tecnico);
            var reclamo = await new Reclamo({
                idCliente, tecnico, marca, modelo, numeroSerie, falla, observacion, estado
            });
            
            await reclamo.save((error, result) => {
                if (error){
                    return res.status(500).send({
                        title: 'Error',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
                req.body.idReclamo = result._id;
                insImagenReclamo(req, res);
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'info',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.updReclamo = async (req, res) => {
    try {
        var {_id, idTecnico, idCliente, marca, modelo, numeroSerie, falla, observacion, estado } = req.body;
        if(!idCliente || !marca || !modelo || !numeroSerie || !falla || !observacion)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos del reclamo.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            idTecnico = idTecnico == '' ? null : idTecnico;
            console.log(idTecnico);
            Reclamo.findByIdAndUpdate(_id, {
                idCliente, idTecnico, marca, modelo, numeroSerie, falla, observacion, estado
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
                    text: '¡Reclamo editado correctamente!',
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
            icon: 'info',
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
            insReclamo(req, res);
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

exports.getTecnico = async (req, res) => {
    try {
        Tecnico.find({ fechaArchivado: null }, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los tecnicos',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true});
        }).populate({
            path: 'idUser',
            select: ['-password', '-createdAt', '-updatedAt']
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

exports.getCliente = async (req, res) => {
    try {
        var { dni } = req.body;
        Cliente.find({dni}, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los clientes',
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

exports.getEstado = async (req, res) => {
    try {
        var { numeroOrden, dni } = req.body;
        if(!numeroOrden || !dni ){
            res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        }else{
            Reclamo.find({
                numeroOrden,
                dni
            }, (error, data) => {
                if(error) {
                    return res.status(500).send({
                        title: 'Error mostrando estado',
                        text: error,
                        icon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
                return res.status(200).send({data: data, session: true});
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