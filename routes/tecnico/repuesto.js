var express = require('express');
var auth = require('../../middlewares/auth');
var proformaController = require('../../controllers/tecnico/repuestoController');
var router = express.Router();

router.post('/getRepuesto', [auth.verifyToken, auth.isTecnico], proformaController.getRepuesto);
router.post('/getRepuestoArchivado', [auth.verifyToken, auth.isTecnico], proformaController.getRepuestoArchivado);
router.post('/insRepuesto', [auth.verifyToken, auth.isTecnico], proformaController.insRepuesto);
router.post('/getProducto', [auth.verifyToken, auth.isTecnico], proformaController.getProducto);
router.post('/getReclamo', [auth.verifyToken, auth.isTecnico], proformaController.getReclamo);

module.exports = router;
