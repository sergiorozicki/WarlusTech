const Persona = require('../models/Persona');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.login = async (req, res) => {
    try {
        const persona = await Persona.findOne({ user: req.body.user, fechaArchivado: null }).populate('idRole');
        if (!persona) return res.status(400).send({ title: "Error", text: "DATOS INCORRECTOS.", icon: 'error', showConfirmButton: true, timer: false });

        const matchPassword = await Persona.comparePassword(req.body.password, persona.password);
        if (!matchPassword) return res.status(400).send({ title: "Error", text: "DATOS INCORRECTOS.", icon: 'error', showConfirmButton: true, timer: false });

        const token = jwt.sign({ id: persona._id, user: persona.user }, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRA });

        const cookiesOptions = { expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), httpOnly: true };
        res.cookie('warlus-tech-access-token', token, cookiesOptions);

        if (persona.idRole.name == 'ADMINISTRATIVO') return res.status(200).send({ ruta: 'administrativo/reclamo', session: true });
        if (persona.idRole.name == 'TECNICO') return res.status(200).send({ ruta: 'tecnico/reclamo', session: true });
        
        res.clearCookie('warlus-tech-access-token');
        return res.status(400).send({ title: "Error", text: "Rol no existe.", icon: 'error', showConfirmButton: true, timer: false });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false }); }
}

exports.logout = (req, res) => {
    res.clearCookie('warlus-tech-access-token');
    return res.redirect('/');
}

exports.changePassword = async (req, res) => {
    try {
        const { passwordActual, passwordNueva, passwordConfirmar } = req.body;
        if(!passwordActual || !passwordNueva || !passwordConfirmar)
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false });

        if(passwordNueva != passwordConfirmar) return res.status(400).send({ title: '¡Ups!', text: 'Las contraseñas no coinciden.', icon: 'info', showConfirmButton: true, timer: false });

        const searchPersona = await Persona.findById( req.idUser );
        if(!searchPersona) res.status(401).send({ title: 'Error', text: 'Error al buscar persona.', icon: 'warning', showConfirmButton: true, timer: false });
        if(!(await Persona.comparePassword(passwordActual, searchPersona.password))){
            return res.status(400).send({ title: 'Error', text: 'La contraseña actual es incorrecta.', icon: 'info', showConfirmButton: true, timer: false });
        }else{
            const updPassword = await Persona.findByIdAndUpdate( req.idUser, { password: await Persona.encryptPassword(passwordNueva)}, { new: true });
            if(!updPassword) return res.status(401).send({ title: 'Error', text: 'Error cambiando contraseña.', icon: 'warning', showConfirmButton: true, timer: false });
            return res.status(200).send({ title: '¡Excelente!', text: '¡La contraseña se modificó correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });
        }

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false }); }
}

exports.enviarEmail = async (req, res) => {
    try {
        const { email, dominio } = req.body;
        
        const persona = await Persona.findOne({ email: req.body.email }).populate('idRole');
        if (!persona) return res.status(400).send({ title: "Error", text: `El correo electrónico ${req.body.email} no está registrado`, icon: 'warning', showConfirmButton: true, timer: false  });
        if(persona.idRole.name == 'CLIENTE') return res.status(400).send({ title: "Error", text: `El correo electrónico ${req.body.email} no está registrado`, icon: 'warning', showConfirmButton: true, timer: false  });

        const token = jwt.sign({ id: persona._id, email: persona.email }, process.env.REESTABLECER_PASS_SECRETO, { expiresIn: process.env.REESTABLECER_PASS_TIEMPO_EXPIRA });

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        const mailOptions = {
            from: 'Warlus Technic',
            to: email,
            subject: 'Reestablecer contraseña.',
            html: `<p>Hemos enviado este correo electrónico para reestablecer su contraseña de Warlus Technic, si no ha sido usted solo ignore este mensaje.</p>
            <b><a href="${dominio}reestablecer-password/${token}">Haga click aquí para reestablecer</a></b>`
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error) return res.status(400).send({ title: 'Error', text: 'Error al enviar email', icon: 'warning', showConfirmButton: true, timer: false });
            else return res.status(200).send({ title: '¡Excelente!', text: `Hemos enviado un correo electrónico a ${req.body.email} para reestablecer su contraseña, revisar la bandeja de correos no deseados (Spam).`, icon: 'success', showConfirmButton: true, timer: false, session: true });
        });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false }); }
}

exports.reestablecerPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.REESTABLECER_PASS_SECRETO);
        return res.status(200).send(`<!doctype html>
        <html lang="es">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Warlus Technic - Cambiar contrase&ntilde;a</title>
                <link rel="stylesheet" type="text/css" href="/stylesheets/icons/adminLTE-2.4.15/font-awesome.min.css">
                <link href="/stylesheets/cambiarPassword.css" rel="stylesheet">
            </head>
            <body>
              <div class="titulo">
                <h1>Cambiar contrase&ntilde;a</h1>
              </div>
              <div id="container">
                <h1>Cambiar contrase&ntilde;a</h1>
              
                <form class="form_cambiar">
                  <img class="loading" style="position: absolute; z-index: 0; margin-top: -100px; display: none;" src="/images/loading.webp">
                  <input type="password" id="password" placeholder="Contrase&ntilde;a">
                  <input type="password" id="passwordConfirmar" placeholder="Confirmar contrase&ntilde;a">
                  <button type="button" id="btn_cambiar">Cambiar</button>
                </form>
              </div>
              
              <script type="text/javascript" src="/javascripts/jquery.min.js"></script>
              <script type="text/javascript" src="/javascripts/sweetalert2@11.js"></script>
              <script type="text/javascript" src="/javascripts/ajax.js"></script>
              <script type="text/javascript" src="/javascripts/comun.js"></script>
              <script type="text/javascript" src="/javascripts/login.js"></script>
              
              <style>
                .form-swal {
                  opacity: .8;
                  color: rgb(0, 0, 0);
                }
              </style>
        
            </body>
        </html>`);

    } catch (error) { return res.status(500).send(`<h1 style="text-align: center;">Token inválido o expirado</h1>`); }
}

exports.cambiarPassword = async (req, res) => {
    try {
        const { token, password, passwordConfirmar } = req.body;
        const decoded = jwt.verify(token, process.env.REESTABLECER_PASS_SECRETO);

        if(!token || !password || !passwordConfirmar) return res.status(400).send({ title: '¡Ups!', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false });
        if(password != passwordConfirmar) return res.status(400).send({ title: '¡Ups!', text: 'Las contraseñas no coinciden.', icon: 'info', showConfirmButton: true, timer: false });

        const searchPersona = await Persona.findOne({ _id: decoded.id, email: decoded.email });
        if (!searchPersona) return res.status(400).send({ title: 'Error', text: `El usuario que intenta modificar no existe.`, icon: 'warning', showConfirmButton: true, timer: false });

        const updPassword = await Persona.findByIdAndUpdate(decoded.id, { password: await Persona.encryptPassword(password) });
        if (!updPassword) return res.status(400).send({ title: 'Error', text: `Error al modicar la contraseña.`, icon: 'warning', showConfirmButton: true, timer: false });
        return res.status(200).send({ title: '¡Excelente!', text: `Se ha modificado su contraseña de forma correcta.`, icon: 'success', showConfirmButton: true, timer: false, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: 'Token inválido o expirado', icon: 'error', showConfirmButton: true, timer: false }); }
}