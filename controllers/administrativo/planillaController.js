const fs = require('fs');
const path = require('path');
const Persona = require('../../models/Persona');

exports.getPlanillaPendiente = async (req, res) => {
    try {
        fs.readdir(path.join(__dirname,'../../files/planillas'), async (error, archivos) => {
            if (error) return res.status(500).send({ title: 'Error mostrando planillas pendientes.', text: error.toString(), icon: 'info', showConfirmButton: true, timer: false, session: true });
            var archivosAux = new Array();
            const searchTecnicos = await Persona.find();
            if(!searchTecnicos) return res.status(401).send({ title: 'Error', text: 'Error mostrando los tecnicos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

            for (var i = 0; i < archivos.length; i++) {
                for (let j = 0; j < searchTecnicos.length; j++)
                    if(archivos[i].split('_')[0] == searchTecnicos[j]._id && archivos[i].split('_')[2].split('.')[0] == 'null') archivosAux.push({ nombre: searchTecnicos[j].nombre, apellido: searchTecnicos[j].apellido, archivo: archivos[i] });
            }
            return res.status(200).send({ data: archivosAux, session: true, user: req.userName });
        });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.downloadPlanillaPendiente = async (req, res) => {
    try {
        return res.download(path.join(__dirname,'../../files/planillas/' + req.query.nombre), (error) => {
            if(error) return res.status(500).send({ title: 'Error descargando planilla pendiente', text: error.toString(), icon: 'info', showConfirmButton: true, timer: false, session: true });
        });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getPlanillaArchivada = async (req, res) => {
    try {
        fs.readdir(path.join(__dirname,'../../files/planillas'), async (error, archivos) => {
            if (error) return res.status(500).send({ title: 'Error mostrando planillas archivadas.', text: error.toString(), icon: 'info', showConfirmButton: true, timer: false, session: true });
            var archivosAux = new Array();
            const searchTecnicos = await Persona.find();
            if(!searchTecnicos) return res.status(401).send({ title: 'Error', text: 'Error mostrando los tecnicos', icon: 'warning', showConfirmButton: true, timer: false, session: true });
            for (var i = 0; i < archivos.length; i++) {
                for (let j = 0; j < searchTecnicos.length; j++)
                    if(archivos[i].split('_')[0] == searchTecnicos[j]._id && archivos[i].split('_')[2].split('.')[0] != 'null') archivosAux.push({ nombre: searchTecnicos[j].nombre, apellido: searchTecnicos[j].apellido, archivo: archivos[i] });
            }
            return res.status(200).send({ data: archivosAux, session: true, user: req.userName });
        });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.downloadPlanillaArchivada = async (req, res) => {
    try {
        return res.download(path.join(__dirname,'../../files/planillas/' + req.query.nombre), (error) => {
            if(error) return res.status(500).send({ title: 'Error descargando planilla archivada.', text: error.toString(), icon: 'info', showConfirmButton: true, timer: false, session: true });
        });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}


exports.desarchivarPlanilla = async (req, res) => {
    try {
        const today = new Date();
        var year = today.getFullYear(), month = parseInt(today.getMonth() + 1), date = today.getDate(), hours = today.getHours(), minutes = today.getMinutes(), seconds = today.getSeconds();
        if(month < 10) month = "0" + month;
        if(date < 10) date = "0" + date;
        if(hours < 10) hours = "0" + hours;
        if(minutes < 10) minutes = "0" + minutes;
        if(seconds < 10) seconds = "0" + seconds;
        const archivo = req.body.nombre;
        const archivoSlit = archivo.split('.')[0].split('_');

        fs.rename(path.join(__dirname,'../../files/planillas/', archivo), path.join(__dirname,'../../files/planillas/' + archivoSlit[0] + '_' + archivoSlit[1] + '_null.' + archivo.split('.')[1]), (error) => {
            if (error) return res.status(500).send({ title: 'Error creando directorio.', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            return res.status(200).send({ title: '¡Excelente!', text: '¡Planilla desarchivada correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });
        });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}