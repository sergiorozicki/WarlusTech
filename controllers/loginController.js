var Usuario = require('../models/Usuario');
var Role = require('../models/Role');
var jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        var usuario = await Usuario.findOne({ user: req.body.user }).populate('idRole');

        if (!usuario) return res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "DATOS INCORRECTOS.",
            alertIcon: 'error',
            showConfirmButton: false,
            timer: 900,
            ruta: '/',
            title: '/'
        });

        var matchPassword = await Usuario.comparePassword(req.body.password, usuario.password);
  
        if (!matchPassword)return res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "DATOS INCORRECTOS.",
            alertIcon: 'error',
            showConfirmButton: false,
            timer: 900,
            ruta: '/',
            title: '/'
        });
  
        var token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRA });

        var cookiesOptions = { expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), httpOnly: true };
        res.cookie('x-access-token', token, cookiesOptions);
        var roles = await Role.find({ _id: { $in: usuario.idRole } });

        for (let i = 0; i < roles.length; i++) {
            
            if (roles[i].name == 'ADMINISTRATIVO' && JSON.stringify(roles[i]._id) == JSON.stringify(usuario.idRole._id)) {
                return res.render('login', {
                    alert: true,
                    alertTitle: "¡Excelente!",
                    alertMessage: "¡DATOS CORRECROS!",
                    alertIcon:'success',
                    showConfirmButton: false,
                    timer: 900,
                    ruta: 'administrativo',
                    title: 'Administrativo'
               });
            }
            if (roles[i].name == 'TECNICO' && JSON.stringify(roles[i]._id) == JSON.stringify(usuario.idRole._id)) {
                return res.render('login', {
                    alert: true,
                    alertTitle: "¡Excelente!",
                    alertMessage: "¡DATOS CORRECROS!",
                    alertIcon:'success',
                    showConfirmButton: false,
                    timer: 900,
                    ruta: 'tecnico',
                    title: 'Tecnico'
               });
            }
        }
  
        return res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Rol no exixte.",
            alertIcon:'error',
            showConfirmButton: false,
            timer: 900,
            ruta: '/',
            title: ''
       });
    } catch (error) {
        console.log(error);
    }
}

exports.logout = (req, res)=>{
    res.clearCookie('x-access-token');
    return res.redirect('/');
}