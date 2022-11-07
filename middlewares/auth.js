const Role = require('../models/Role');
const Persona = require('../models/Persona');
const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
    try {
        //const token = req.cookies['warlus-tech-access-token'];
        const token = req.headers.cookie.split('warlus-tech-access-token=')[1];
        if (!token) {res.clearCookie('warlus-tech-access-token'); return res.redirect('/');}
        const decoded = jwt.verify(token, process.env.JWT_SECRETO);
        req.idUser = decoded.id;
    
        const persona = await Persona.findById(req.idUser, { password: 0 });
        if (!persona) {res.clearCookie('warlus-tech-access-token'); return res.redirect('/');}
    
        next();
    } catch (error) {
        console.log(error);
        res.clearCookie('warlus-tech-access-token');
        return res.send({error});
    }
}

exports.verifyTokenLogin = async (req, res, next) => {
    try {
        const token = req.cookies['warlus-tech-access-token'];
        if (!token) {next(); return;}
        const decoded = jwt.verify(token, process.env.JWT_SECRETO);
        req.idUser = decoded.id;
    
        const persona = await Persona.findById(req.idUser, { password: 0 });
        
        if (!persona) { next(); return; }
        else{
            const roles = await Role.find({ _id: { $in: persona.idRole } });
    
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name == 'ADMINISTRATIVO' && JSON.stringify(roles[i]._id) == JSON.stringify(persona.idRole)) {
                    return res.redirect('administrativo/reclamo');
                }
                if (roles[i].name == 'TECNICO' && JSON.stringify(roles[i]._id) === JSON.stringify(persona.idRole)) {
                    return res.redirect('tecnico/reclamo');
                }
            }
            res.clearCookie('warlus-tech-access-token');
            return res.status(401).send({message: 'Error, se requiere rol.'});
        }
    } catch (error) {
        return res.status(500).send({error});
    }
}

exports.isAdministrativo = async (req, res, next) => {
    try {
        const persona = await Persona.findById(req.idUser);
        req.userName = persona.user;
        const roles = await Role.find({ _id: { $in: persona.idRole } });
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
        //const tecnico = await Tecnico.findOne({idUser: req.idUser});
        //if (tecnico.length == 0) return res.status(403).send({ message: "El usuario está asociado a ni un Técnico." });
        //req.idTecnico = tecnico._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        const persona = await Persona.findById(req.idUser);
        req.userName = persona.user;
        const roles = await Role.find({ _id: { $in: persona.idRole } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name == 'TECNICO') {
                req.idTecnico = persona._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
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

exports.isAdministrativoOrTecnico = async (req, res, next) => {
    try {
        const persona = await Persona.findById(req.idUser);
        req.userName = persona.user;
        const roles = await Role.find({ _id: { $in: persona.idRole } });
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name == 'ADMINISTRATIVO') {
                next();
                return;
            }
            if (roles[i].name == 'TECNICO') {
                //var tecnico = await Tecnico.findOne({idUser: req.idUser});
                //if (tecnico.length == 0) return res.status(403).send({ message: "El usuario está asociado a ni un Técnico." });
                next();
                return;
            }
        }
        return res.status(403).send({ message: "Se requiere rol válido." });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error });
    }
}