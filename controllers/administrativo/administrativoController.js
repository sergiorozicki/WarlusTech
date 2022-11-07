const Persona = require('../../models/Persona');
const Role = require('../../models/Role');
const autoIncrementController = require('../../autoIncrement/autoIncrement.controller');

exports.getAdministrativo = async (req, res) => {
    try {
        const roleSearch = await Role.findOne({ name: 'ADMINISTRATIVO' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const personasSearch = await Persona.find({ fechaArchivado: null, idRole: roleSearch._id }, {password: 0}).sort({legajo: -1});
        return res.status(200).send({data: personasSearch, session: true, user: req.userName});

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getAdministrativoArchivado = async (req, res) => {
    try {
        const roleSearch = await Role.findOne({ name: 'ADMINISTRATIVO' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const personasSearch = await Persona.find({fechaArchivado: {$ne :null}, idRole: roleSearch._id}, {password: 0}).sort({legajo: -1});
        return res.status(200).send({data: personasSearch, session: true, user: req.userName});

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.insAdministrativo = async (req, res) => {
    try {
        const { apellido, nombre, dni, telefono, email, direccion, codigoPostal, cbu, horarioDesde, horarioHasta, user, password, passwordConfirmar } = req.body;
        if(!apellido || !nombre || !dni || !telefono || !email || !direccion || !codigoPostal || !cbu || !horarioDesde || !horarioHasta || !user || !password || !passwordConfirmar)
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        if(password != passwordConfirmar) return res.status(400).send({ title: '¡Ups!', text: 'Las contraseñas no coinciden', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const roleSearch = await Role.findOne({ name: 'ADMINISTRATIVO' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const incrementLegajo = await autoIncrementController.incrementDocument('legajoPersonas');
        if(incrementLegajo.status == 400) return res.status(400).send({ title: 'Error', text: incrementLegajo.msg, icon: 'warning', showConfirmButton: true, timer: false, session: true });
        const legajo = incrementLegajo.msg;

        const addPersona = await new Persona({ idRole: roleSearch._id, apellido, nombre, dni, telefono, email, direccion, codigoPostal, cbu, horarioDesde, horarioHasta, legajo, user, password: await Persona.encryptPassword(password) }).save();
        if(!addPersona) return res.status(400).send({ title: 'Error', text: 'Error al agregar administrativo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Administrativo agregado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.updAdministrativo = async (req, res) => {
    try {
        const { _id, apellido, nombre, dni, telefono, email, direccion, codigoPostal, cbu, horarioDesde, horarioHasta, user } = req.body;
        if(!_id || !apellido || !nombre || !dni || !telefono || !email || !direccion || !codigoPostal || !cbu || !horarioDesde || !horarioHasta || !user)
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const personaSearch = await Persona.findById(_id);
        if(!personaSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar administrativo', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const updPersona = await Persona.findByIdAndUpdate(_id, { apellido, nombre, dni, telefono, email, direccion, codigoPostal, cbu, horarioDesde, horarioHasta, user });
        if(!updPersona) return res.status(400).send({ title: 'Error', text: 'Error al agregar administrativo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Administrativo modificado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.archivarAdministrativo = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const personaSearch = await Persona.findById(_id);
        if(!personaSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar administrativo', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const archivarPersona = await Persona.findByIdAndUpdate(_id, { fechaArchivado: new Date() });
        if(!archivarPersona) return res.status(400).send({ title: 'Error', text: 'Error al archivar administrativo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Administrativo archivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.desarchivarAdministrativo = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const personaSearch = await Persona.findById(_id);
        if(!personaSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar administrativo', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const archivarPersona = await Persona.findByIdAndUpdate(_id, { $unset: { fechaArchivado: -1 } });
        if(!archivarPersona) return res.status(400).send({ title: 'Error', text: 'Error al desarchivar administrativo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Administrativo desarchivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}