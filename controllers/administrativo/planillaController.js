var fs = require('fs');
var path = require('path');
var Tecnico = require('../../models/Tecnico');

exports.getPlanillaPendiente = async (req, res) => {
    try {
        fs.readdir(path.join(__dirname,'../../files/planillas'), function (error, archivos) {
            if (error) {
                return res.status(500).send({
                    title: 'Error mostrando planillas pendientes.',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            var archivosAux = new Array();
            Tecnico.find({}, (error, data) => {
                if(error) {
                    return res.status(400).send({
                        title: 'Error mostrando los tecnicos',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
                for (var i = 0; i < archivos.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if(archivos[i].split('_')[0] == data[j]._id && archivos[i].split('_')[2].split('.')[0] == 'null'){
                            archivosAux.push({
                                _idTecnico: data[j]._id,
                                _idUsuario: data[j].idUser._id,
                                nombre: data[j].idUser.nombre,
                                apellido: data[j].idUser.apellido,
                                archivo: archivos[i]
                            });
                        }
                    }
                }
                return res.status(200).send({data: archivosAux, session: true, user: req.userName});
            }).populate('idUser', ['apellido', 'nombre', 'user']);
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

exports.downloadPlanillaPendiente = async (req, res) => {
    try {
        return res.download(path.join(__dirname,'../../files/planillasPendientes/' + req.query.nombre), (error) => {
            if(error){
                return res.status(500).send({
                    title: 'Error descargando planilla pendiente.',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
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

exports.getPlanillaArchivada = async (req, res) => {
    try {
        fs.readdir(path.join(__dirname,'../../files/planillas'), function (error, archivos) {
            if (error) {
                return res.status(500).send({
                    title: 'Error mostrando planillas archivadas.',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            var archivosAux = new Array();
            Tecnico.find({}, (error, data) => {
                if(error) {
                    return res.status(400).send({
                        title: 'Error mostrando los tecnicos',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
                for (var i = 0; i < archivos.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if(archivos[i].split('_')[0] == data[j]._id && archivos[i].split('_')[2].split('.')[0] != 'null'){
                            archivosAux.push({
                                _idTecnico: data[j]._id,
                                _idUsuario: data[j].idUser._id,
                                nombre: data[j].idUser.nombre,
                                apellido: data[j].idUser.apellido,
                                archivo: archivos[i]
                            });
                        }
                    }
                }
                return res.status(200).send({data: archivosAux, session: true, user: req.userName});
            }).populate('idUser', ['apellido', 'nombre', 'user']);
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

exports.downloadPlanillaArchivada = async (req, res) => {
    try {
        return res.download(path.join(__dirname,'../../files/planillasArchivadas/' + req.query.nombre), (error) => {
            if(error){
                return res.status(500).send({
                    title: 'Error descargando planilla archivada.',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
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