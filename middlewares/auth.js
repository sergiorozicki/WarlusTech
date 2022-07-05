var Usuario = require('../models/Usuario');
var Role = require('../models/Role');
var Tecnico = require('../models/Tecnico');
var jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
    try {
        var token = req.cookies['x-access-token'];
        if (!token) {res.clearCookie('x-access-token'); return res.redirect('/');}
        var decoded = jwt.verify(token, process.env.JWT_SECRETO);
        req.idUser = decoded.id;
    
        var usuario = await Usuario.findById(req.idUser, { password: 0 });
        if (!usuario) {res.clearCookie('x-access-token'); return res.redirect('/');}
    
        next();
    } catch (error) {
        console.log(error);
        res.clearCookie('x-access-token');
        return res.send({error});
    }
}

exports.verifyTokenLogin = async (req, res, next) => {
    try {
        var token = req.cookies['x-access-token'];
        if (!token) {next(); return;}
        var decoded = jwt.verify(token, process.env.JWT_SECRETO);
        req.idUser = decoded.id;
    
        var usuario = await Usuario.findById(req.idUser, { password: 0 });
        
        if (!usuario) { next(); return; }
        else{
            var roles = await Role.find({ _id: { $in: usuario.idRole } });
    
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name == 'ADMINISTRATIVO' && JSON.stringify(roles[i]._id) == JSON.stringify(usuario.idRole)) {
                    return res.redirect('administrativo');
                }
                if (roles[i].name == 'TECNICO' && JSON.stringify(roles[i]._id) === JSON.stringify(usuario.idRole)) {
                    return res.redirect('tecnico');
                }
            }
            res.clearCookie('x-access-token');
            return res.status(401).send({message: 'Error, se requiere rol.'});
        }
    } catch (error) {
        return res.status(500).send({error});
    }
}

exports.isAdministrativo = async (req, res, next) => {
    try {
        var usuario = await Usuario.findById(req.idUser);
        req.userName = usuario.user;
        var roles = await Role.find({ _id: { $in: usuario.idRole } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name == 'ADMINISTRATIVO') {
                next();
                return;
            }
        }
        return res.status(403).send({ message: "Se requiere rol Administrador." });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error });
    }
}

exports.isTecnico = async (req, res, next) => {
    try {
        var tecnico = await Tecnico.findOne({idUser: req.idUser});
        if (tecnico.length == 0) return res.status(403).send({ message: "El usuario está asociado a ni un Técnico." });
        req.idTecnico = tecnico._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        var usuario = await Usuario.findById(req.idUser);
        req.userName = usuario.user;
        var roles = await Role.find({ _id: { $in: usuario.idRole } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name == 'TECNICO') {
                next();
                return;
            }
        }
        return res.status(403).send({ message: "Se requiere rol Técnico." });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error });
    }
}