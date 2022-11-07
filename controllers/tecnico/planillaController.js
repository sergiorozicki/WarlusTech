const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mimeTypes = require('mime-types');

const storage = multer.diskStorage({
    destination: 'files/planillas',
    filename: function(req, file, cb){
        const today = new Date();
        var year = today.getFullYear(), month = parseInt(today.getMonth() + 1), date = today.getDate(), hours = today.getHours(), minutes = today.getMinutes(), seconds = today.getSeconds();
        if(month < 10) month = "0" + month;
        if(date < 10) date = "0" + date;
        if(hours < 10) hours = "0" + hours;
        if(minutes < 10) minutes = "0" + minutes;
        if(seconds < 10) seconds = "0" + seconds;
        cb("", req.idTecnico + "_" + year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds + "_null" + "." + mimeTypes.extension(file.mimetype))
    }
});

const upload = multer({storage: storage});
const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }]);

exports.insPlanilla = async (req, res) => {
    try {
        cpUpload(req, res, function (error) {
            if (error instanceof multer.MulterError) return res.status(500).send({ title: 'Error insertando planilla', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            if (error) return res.status(500).send({ title: 'Error insertando planilla', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            return res.status(200).send({ title: '¡Excelente!', text: '¡Planilla publicada correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });
        });
          
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getPlanillaPendiente = async (req, res) => {
    try {
        fs.readdir(path.join(__dirname,'../../files/planillas'), function (error, archivos) {
            if (error) return res.status(500).send({ title: 'Error mostrando planillas.', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            var archivosAux = new Array();
            for (var i = 0; i < archivos.length; i++) if(archivos[i].split('_')[0] == req.idTecnico && archivos[i].split('.')[0].split('_')[2] == 'null') archivosAux.push(archivos[i])
            return res.status(200).send({data: archivosAux, session: true, user: req.userName});
        });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getPlanillaArchivada = async (req, res) => {
    try {
        fs.readdir(path.join(__dirname,'../../files/planillas'), function (error, archivos) {
            if (error) return res.status(500).send({ title: 'Error mostrando planillas.', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            var archivosAux = new Array();
            for (var i = 0; i < archivos.length; i++)
                if(archivos[i].split('_')[0] == req.idTecnico && archivos[i].split('.')[0].split('_')[2] != 'null') archivosAux.push(archivos[i])
            return res.status(200).send({data: archivosAux, session: true, user: req.userName});
        });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.downloadPlanilla = async (req, res) => {
    try {
        return res.download(path.join(__dirname,'../../files/planillas/' + req.query.nombre), (error) => {
            if(error) return res.status(500).send({ title: 'Error descargando planillas.', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
        });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.archivarPlanilla = async (req, res) => {
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

        fs.rename(path.join(__dirname,'../../files/planillas/', archivo), path.join(__dirname,'../../files/planillas/' + archivoSlit[0] + '_' + archivoSlit[1] + '_' + year + '' + month + '' + date + '' + hours + '' + minutes + '' + seconds + '.' + archivo.split('.')[1]), (error) => {
            if (error) return res.status(500).send({ title: 'Error creando directorio.', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            return res.status(200).send({ title: '¡Excelente!', text: '¡Planilla archivada correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });
        });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}