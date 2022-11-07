const Proforma = require('../../models/Proforma');
const Role = require('../../models/Role');
const Producto = require('../../models/Producto');
const Persona = require('../../models/Persona');
const fs = require('fs');
const path = require('path');

exports.getProforma = async (req, res) => {
    try {
        const searchProforma = await Proforma.find({ idTecnico: req.idTecnico }, { 'idTecnico.password': 0 }).sort({ createdAt: -1 }).populate('idCliente').populate('idProducto').populate({ path: 'idTecnico', select: ['-password', '-idRole'] });
        return res.status(200).send({ data: searchProforma, session: true, user: req.userName, idTecnico: req.idTecnico });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.insOrUpdCliente = async (req, res) => {
    try {
        const { nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal } = req.body;

        if(!nombre || !apellido || !dni || !telefono || !email || !direccion || !localidad || !codigoPostal)
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const roleSearch = await Role.findOne({ name: 'CLIENTE' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const query = { dni },
        update = { idRole: roleSearch._id, nombre, apellido, dni, telefono, email, direccion, localidad, codigoPostal },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const insUpdCliente = await Persona.findOneAndUpdate(query, update, options);
        if (!insUpdCliente) return res.status(401).send({ title: 'Error', text: 'Error guardando cliente.', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        req.body.idCliente = insUpdCliente._id;
        if (req.body.functionBack == 'insProforma') insProforma(req, res);
        else updProforma(req, res);

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

const insProforma = async (req, res) => {
    try {
        const { idTecnico, idCliente, idProducto, idModelo, observacion } = req.body;
        if(!idTecnico || !idCliente || !idProducto || !idModelo || !observacion)
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const addProforma = await new Proforma({ idTecnico, idCliente, idProducto, idModelo, observacion }).save();
        if (!addProforma) return res.status(401).send({ title: 'Error', text: 'Error guardando profofma.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelente!', text: '¡Proforma registrada correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

const updProforma = async (req, res) => {
    try {
        const {_id, idTecnico, idCliente, idProducto, idModelo, observacion } = req.body;
        if(!_id || !idTecnico || !idCliente || !idProducto || !idModelo || !observacion)
            return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const updProforma = await Proforma.findByIdAndUpdate( _id, { idTecnico, idCliente, idProducto, idModelo, observacion });
        if(!updProforma) return res.status(401).send({ title: 'Error', text: 'Error editando proforma.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelente!', text: '¡Proforma editado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}


exports.getCliente = async (req, res) => {
    try {
        const { dni } = req.body;
        const roleSearch = await Role.findOne({ name: 'CLIENTE' });
        if(!roleSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar rol', icon: 'warning', showConfirmButton: true, timer: false, session: true });

        const clienteSearch = await Persona.find({ dni, idRole: roleSearch._id });
        return res.status(200).send({ data: clienteSearch, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getProducto = async (req, res) => {
    try {
        const searchProducto = await Producto.find({ fechaArchivado: null });
        return res.status(200).send({ data: searchProducto, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

const comprobarSiExisteDirectorio = () => {
    return new Promise((resolve, rejects) => {
        if(!fs.existsSync(path.join(__dirname,'../../public/images/logoTecnico/')))
            fs.mkdir(path.join(__dirname,'../../public/images/logoTecnico/'), (error) => {
                if (error) rejects({ title: 'Error creando directorio.', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
            });
        resolve();
    });
}

function writeImage(destino, base64Data){
    return new Promise((resolve, rejects) => {
        fs.writeFileSync(destino, base64Data,  {encoding: 'base64'}, (error) => {
            if (error) rejects({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true });
        });
        resolve();
    });
}

exports.insLogo = async (req, res) => {
    try {
        await comprobarSiExisteDirectorio();
        destino = path.join(__dirname,'../../public/images/logoTecnico/') + req.idTecnico + ".png";
        imageData = req.body.logo;
        base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        await writeImage(destino, base64Data);
        return res.status(200).send({ title: '¡Excelente!', text: '¡Logo guardado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}