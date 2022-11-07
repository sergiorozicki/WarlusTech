const Producto = require('../../models/Producto');

exports.getProducto = async (req, res) => {
    try {
        const searchProducto = await Producto.find({ fechaArchivado: null }).sort({ numeroOrden: -1 });
        return res.status(200).send({ data: searchProducto, session: true, user: req.userName });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.getProductoArchivado = async (req, res) => {
    try {
        const searchProducto = await Producto.find({ fechaArchivado: { $ne: null }}).sort({ numeroOrden: -1 });
        return res.status(200).send({ data: searchProducto, session: true, user: req.userName });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.insProducto = async (req, res) => {
    try {
        const {descripcion, marca} = req.body;
        if(!descripcion || !marca) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const insProducto = await new Producto({ descripcion, marca }).save();
        if (!insProducto) return res.status(401).send({ title: 'Error', text: 'Error guardando producto.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Producto guardado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.updProducto = async (req, res) => {
    try {
        const {_id, descripcion, marca} = req.body;
        if(!_id || !descripcion || !marca) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const updProducto = await Producto.findByIdAndUpdate(_id, { descripcion, marca });
        if(!updProducto)return res.status(401).send({ title: 'Error', text: 'Error editando producto.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Producto editado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.archivarProducto = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const archivarProducto = await Producto.findByIdAndUpdate( _id, { fechaArchivado: new Date() });
        if(!archivarProducto) return res.status(401).send({ title: 'Error', text: 'Error archivando producto.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Producto archivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.desarchivarProducto = async (req, res) => {
    try {
        const { _id } = req.body;
        if(!_id) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const desarchivarProducto = await Producto.findByIdAndUpdate( _id, { $unset: { fechaArchivado: -1 }});
        if(!desarchivarProducto) return res.status(401).send({ title: 'Error', text: 'Error desarchivando producto.', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: 'Producto desarchivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });
        
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.archivarModelo = async (req, res) => {
    try {
        const { idModelo } = req.body;
        if(!idModelo) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const updModelo = await Producto.findOneAndUpdate({ 'modelo._id': idModelo }, { 'modelo.$.fechaArchivado': new Date() });
        if(!updModelo) return res.status(400).send({ title: 'Error', text: 'Error archivando modelo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Modelo archivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.desarchivarModelo = async (req, res) => {
    try {
        const { idModelo } = req.body;
        if(!idModelo) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const updModelo = await Producto.findOneAndUpdate({ 'modelo._id': idModelo }, { $unset: { 'modelo.$.fechaArchivado': -1 } });
        if(!updModelo) return res.status(400).send({ title: 'Error', text: 'Error desarchivando modelo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: 'Modelo desarchivado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.insModelo = async (req, res) => {
    try {
        const {_id, modelo} = req.body;
        if(!_id || !modelo) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const producroSearch = await Producto.findById(_id)
        if(!producroSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar el producto.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const addModelo = await Producto.findByIdAndUpdate(_id, { $addToSet: { modelo: modelo } });
        if(!addModelo) return res.status(400).send({ title: 'Error', text: 'Error al agregar modelo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Modelo registrado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}

exports.updModelo = async (req, res) => {
    try {
        const {_id, idModelo, modelo } = req.body;
        if(!_id || !idModelo || !modelo) return res.status(400).send({ title: 'Advertencia', text: 'Complete todos los campos.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const producroSearch = await Producto.findById(_id)
        if(!producroSearch) return res.status(400).send({ title: 'Error', text: 'Error al buscar el producto.', icon: 'info', showConfirmButton: true, timer: false, session: true });

        const updModelo = await Producto.findOneAndUpdate({ 'modelo._id': idModelo }, { 'modelo.$.nombre': modelo.nombre });
        if(!updModelo) return res.status(400).send({ title: 'Error', text: 'Error al editar modelo', icon: 'warning', showConfirmButton: true, timer: false, session: true });
        return res.status(200).send({ title: '¡Excelenete!', text: '¡Modelo editado correctamente!', icon: 'success', showConfirmButton: false, timer: 1500, session: true });

    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
}