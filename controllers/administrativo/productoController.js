var Producto = require('../../models/Producto');

exports.getProducto = async (req, res) => {
    try {
        Producto.find({fechaArchivado: null}, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los Productos',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName});
        }).sort({numeroOrden: -1});
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'info',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.getProductoArchivado = async (req, res) => {
    try {
        Producto.find({fechaArchivado: {$ne :null}}, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los Productos',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName});
        }).sort({numeroOrden: -1});
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'info',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.insProducto = async (req, res) => {
    try {
        var {descripcion, marca, modelo, numeroSerie} = req.body;
        if(!descripcion || !marca || !modelo || !numeroSerie){
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        }else{
            var producto = await new Producto({
                descripcion,
                marca,
                modelo,
                numeroSerie
            });
            
            await producto.save((error) => {
                if (error) return res.status(400).send({
                    title: 'Error222',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
            });
                return res.status(200).send({
                    title: 'Producto exitoso',
                    text: '¡Producto registrado correctamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    session: true
                });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'info',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.updProducto = async (req, res) => {
    try {
        var {_id, descripcion, marca, modelo, numeroSerie } = req.body;
        if(!descripcion || !marca || !modelo || !numeroSerie){
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        }else{
            Producto.findByIdAndUpdate(_id, {
                descripcion,
                marca,
                modelo,
                numeroSerie
            }, (error, result)=>{
                if(error){
                    return res.status(500).send({
                        title: 'Error',
                        text: error,
                        icon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
                return res.status(200).send({
                    title: 'Producto exitoso',
                    text: '¡Producto editado correctamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    session: true
                });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            title: 'Error',
            text: error,
            icon: 'info',
            showConfirmButton: true,
            timer: false,
            session: true
        });
    }
}

exports.archivarProducto = async (req, res) => {
    try {
        var { _id } = req.body;
        if(!_id)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            Producto.findByIdAndUpdate(_id, { fechaArchivado: new Date() }, (error, result)=>{
                if(error) return res.status(500).send({
                    title: 'Error archivando producto',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                return res.status(200).send({
                    title: '¡Excelenete!',
                    text: '¡Producto archivado correctamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    session: true
                });
            });
        }
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

exports.desarchivarProducto = async (req, res) => {
    try {
        var { _id } = req.body;
        if(!_id)
            return res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        else{
            Producto.findByIdAndUpdate(_id, { fechaArchivado: null }, (error, result)=>{
                if(error) return res.status(500).send({
                    title: 'Error desarchivando producto',
                    text: error,
                    icon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
                return res.status(200).send({
                    title: '¡Excelenete!',
                    text: 'Producto desarchivado correctamente!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    session: true
                });
            });
        }
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