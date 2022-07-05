var Tecnico = require('../../models/Tecnico');
var Usuario = require('../../models/Usuario');

exports.getTecnico = async (req, res) => {
    try {
        Tecnico.find({fechaArchivado: null}, (error, data) => {
            if(error) return res.status(400).send({
                title: 'Error mostrando los tecnicos',
                text: error,
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
            return res.status(200).send({data: data, session: true, user: req.userName});
        }).sort({legajo: -1}).populate('idUser', ['nombre', 'apellido', 'email', 'user']);
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

exports.getTecnicoArchivado = async (req, res) => {
    try {
        Tecnico.find({fechaArchivado: {$ne :null}}, (error, data) => {
            if(error) return res.status(400).send({
                title: 'Error mostrando los tecnicos',
                text: error,
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
            return res.status(200).send({data: data, session: true, user: req.userName});
        }).sort({legajo: -1}).populate('idUser', ['nombre', 'apellido', 'email', 'user']);
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

exports.insTecnico = async (req, res) => {
    try {
        var { idUser, dni, telefono, localidad, provincia, direccion, cbu, serviceNombre, horarioDesde, horarioHasta } = req.body;
        if(!idUser || !dni || !telefono || !localidad || !provincia || !direccion || !cbu || !serviceNombre || !horarioDesde || !horarioHasta)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            var today = new Date();
            var year = today.getFullYear();
            var date = today.getDate();
            var month = parseInt(today.getMonth() + 1);
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            horarioDesde = year + "-" + month + "-" + date + "T" + horarioDesde +":00Z";
            horarioHasta = year + "-" + month + "-" + date + "T" + horarioHasta +":00Z";

            Tecnico.find({idUser}, async (error, data) => {
                if(error) return res.status(500).send({
                    title: 'Error mostrando los tecnicos',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                if (data.length == 0) {
                    var tecnico = await new Tecnico({ idUser, dni, telefono, localidad, provincia, direccion, cbu, serviceNombre, horarioDesde: new Date(horarioDesde), horarioHasta: new Date(horarioHasta) });
            
                    await tecnico.save((error, result) => {
                        if(error) return res.status(500).send({
                            title: 'Error al guardar tecnico',
                            text: error,
                            icon: 'error',
                            showConfirmButton: true,
                            timer: false,
                            session: true
                        });

                        return res.status(200).send({
                            title: '¡Excelente!',
                            text: '¡Tecnico registrado correctamente!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                            session: true
                        });
                    });
                }else
                return res.status(400).send({
                    title: '¡Ups!',
                    text: 'El usuario seleccionado ya fué decignado.',
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
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

exports.updTecnico = async (req, res) => {
    try {
        var { _id, idUser, dni, telefono, localidad, provincia, direccion, cbu, serviceNombre, horarioDesde, horarioHasta } = req.body;
        if(!idUser || !dni || !telefono || !localidad || !provincia || !direccion || !cbu || !serviceNombre || !horarioDesde || !horarioHasta)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            var today = new Date();
            var year = today.getFullYear();
            var date = today.getDate();
            var month = parseInt(today.getMonth() + 1);
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            horarioDesde = year + "-" + month + "-" + date + "T" + horarioDesde +":00Z";
            horarioHasta = year + "-" + month + "-" + date + "T" + horarioHasta +":00Z";

            Tecnico.find({idUser: {$ne: req.body.userActual}}, {idUser: 1, _id: 0}, (error, result) => {
                if(error) return res.status(500).send({
                    title: 'Error mostrando los técnicos',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });

                for (var i = 0; i < result.length; i++) {
                    var userLimpio = result[i].idUser.toString().replace(/ObjectId\("(.*)"\)/, "$1");
                    if (req.body.idUser == userLimpio)
                        return res.status(400).send({
                            title: '¡Ups!',
                            text: 'El usuario seleccionado ya fué decignado.',
                            icon: 'info',
                            showConfirmButton: true,
                            timer: false,
                            session: true
                        });
                }

                Tecnico.findByIdAndUpdate(_id, { idUser, dni, telefono, localidad, provincia, direccion, cbu, serviceNombre, horarioDesde: new Date(horarioDesde), horarioHasta: new Date(horarioHasta) }, (error, result)=>{
                    if(error) return res.status(500).send({
                        title: 'Error editando técnico',
                        text: error,
                        icon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                    return res.status(200).send({
                        title: '¡Excelenete!',
                        text: '¡Técnico editado correctamente!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        session: true
                    });
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

exports.archivarTecnico = async (req, res) => {
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
            Tecnico.findByIdAndUpdate(_id, { fechaArchivado: new Date() }, (error, result)=>{
                if(error) return res.status(500).send({
                    title: 'Error archivando técnico',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                return res.status(200).send({
                    title: '¡Excelenete!',
                    text: '¡Técnico archivado correctamente!',
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

exports.desarchivarTecnico = async (req, res) => {
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
            Tecnico.findByIdAndUpdate(_id, { fechaArchivado: null }, (error, result)=>{
                if(error) return res.status(500).send({
                    title: 'Error desarchivando técnico',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                return res.status(200).send({
                    title: '¡Excelenete!',
                    text: '¡Técnico desarchivado correctamente!',
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

exports.getUsuario = async (req, res) => {
    try {
        var usuarios = new Array();
        Tecnico.find({ fechaArchivado: null }, (error, result) => {
            if(error)
                return res.status(500).send({
                title: 'Error mostrando los tecnicos',
                text: error,
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
            
            result.forEach((i) => {
                var userLimpio = i.idUser.toString().replace(/ObjectId\("(.*)"\)/, "$1");
                if (req.body._id != userLimpio) usuarios.push(userLimpio);
            });
            
            Usuario.find({_id: { $nin: usuarios}}, (error, result) => {
                if(error)
                    return res.status(500).send({
                        title: 'Error mostrando los usuarios',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                    var listanueva = result.filter(function(valor) { if (valor.idRole) return true; else return false; });
                    return res.status(200).send({data: listanueva, session: true});
                }).
                sort({apellido: 1}).
                populate({
                    path: 'idRole',
                    match: {name: 'TECNICO'},
                    select: {name: 1, _id: 0}})
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
                numeroOrden
            }, (error, data) => {
                if(error) {
                    return res.status(500).send({
                        title: 'Error mostrando estado',
                        text: error,
                        icon: 'info',
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