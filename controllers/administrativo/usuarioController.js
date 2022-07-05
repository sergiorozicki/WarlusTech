var Usuario = require('../../models/Usuario');
var Role = require('../../models/Role');

exports.getUsuario = async (req, res) => {
    try {
        Usuario.find({fechaArchivado: null}, {password: 0, createAt: 0, updatedAt: 0}, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los usuarios',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName});
        }).sort({legajo: -1}).populate('idRole');
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

exports.getUsuarioArchivado = async (req, res) => {
    try {
        Usuario.find({fechaArchivado: {$ne :null}}, {password: 0, createAt: 0, updatedAt: 0}, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los usuarios',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName});
        }).sort({legajo: -1}).populate('idRole');
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

exports.insUsuario = async (req, res) => {
    try {
        var { nombre, apellido, email, user, password, passwordConfirmar, idRole } = req.body;
        if(password != passwordConfirmar){
            res.status(400).send({
                title: 'Ups',
                text: 'Las contraseñas no coinciden.',
                icon:'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        }else{
            var usuario = await new Usuario({
                apellido,
                nombre,
                email,
                user,
                password: await Usuario.encryptPassword(password),
                idRole
            });
            //usuario.roles = JSON.parse(roles).map((role) => role._id);
        
            await usuario.save((error) => {
                if (error) return res.status(500).send({
                    title: 'Error',
                    text: error,
                    icon:'success',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });

                return res.status(200).send({
                    title: '¡Excelente!',
                    text: '¡Usuario registrado correctamente!',
                    icon:'success',
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

exports.updUsuario = async (req, res) => {
    try {
        var { _id, nombre, apellido, email, user, passwordActual, passwordNueva, passwordConfirmar, idRole } = req.body;
        if(passwordNueva != passwordConfirmar){
            res.status(400).send({
                title: 'Ups',
                text: 'Las contraseñas no coinciden.',
                icon:'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        }else{
            Usuario.find({
                _id: _id
            }, async (error, results) => {
                if(error) {
                    res.status(500).send({
                        title: 'Error',
                        text: error,
                        icon:'error',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                };
                if( results.length == 0 || ! (await Usuario.comparePassword(passwordActual, results[0].password)) ){
                    return res.status(400).send({
                        title: 'Error',
                        text: 'La contraseña actual es incorrecta.',
                        icon:'error',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }else{                    
                    Usuario.findByIdAndUpdate(_id, {
                        apellido,
                        nombre,
                        email,
                        user,
                        password: await Usuario.encryptPassword(passwordNueva),
                        idRole
                    }, {new: true}, (error, result) => {
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
                            text: '¡El usuario se modificó correctamente!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                            session: true
                        });
                    });
                }
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

exports.archivarUsuario = async (req, res) => {
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
            Usuario.findByIdAndUpdate(_id, { fechaArchivado: new Date() }, (error, result)=>{
                if(error) return res.status(500).send({
                    title: 'Error archivando usuario',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                return res.status(200).send({
                    title: '¡Excelenete!',
                    text: '¡Usuario archivado correctamente!',
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

exports.desarchivarUsuario = async (req, res) => {
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
            Usuario.findByIdAndUpdate(_id, { fechaArchivado: null }, (error, result)=>{
                if(error) return res.status(500).send({
                    title: 'Error desarchivando usuario',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                return res.status(200).send({
                    title: '¡Excelenete!',
                    text: '¡Usuario desarchivado correctamente!',
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

exports.getRole = async (req, res) => {
    try {
        Role.find({}, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los roles',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true});
        }).sort({legajo: -1});
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