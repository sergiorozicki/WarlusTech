var Reclamo = require('../../models/Reclamo');

exports.getReclamo = async (req, res) => {
    try {
        Reclamo.find({idTecnico: req.idTecnico}, (error, data) => {
            if(error) {
                return res.status(500).send({
                    title: 'Error mostrando los reclamos',
                    text: error,
                    icon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    session: true
                });
            }
            return res.status(200).send({data: data, session: true, user: req.userName});
        }).sort({numeroOrden: -1}).populate('idCliente').
            populate({path: 'idTecnico',
                populate: {
                    path: 'idUser',
                    select: ['-password', '-createdAt', '-updatedAt']
                }
            });
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

exports.getEstado = async (req, res) => {
    try {
        var { numeroOrden, dni } = req.body;
        if(!numeroOrden || !dni ){
            res.status(400).send({
                title: 'Advertencia',
                text: 'Complete todos los campos.',
                icon: 'info',
                showConfirmButton: true,
                timer: false,
                session: true
            });
        }else{
            Reclamo.find({
                numeroOrden,
                dni
            }, (error, data) => {
                if(error) {
                    return res.status(500).send({
                        title: 'Error mostrando estado',
                        text: error,
                        icon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        session: true
                    });
                }
                return res.status(200).send({data: data, session: true});
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