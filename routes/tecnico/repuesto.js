var express = require('express');
var auth = require('../../middlewares/auth');
var repuestoController = require('../../controllers/tecnico/repuestoController');
var router = express.Router();

router.post('/getRepuesto', [auth.verifyToken, auth.isTecnico], repuestoController.getRepuesto);
router.post('/getRepuestoArchivado', [auth.verifyToken, auth.isTecnico], repuestoController.getRepuestoArchivado);
router.post('/insRepuesto', [auth.verifyToken, auth.isTecnico], repuestoController.insRepuesto);
router.post('/getReclamo', [auth.verifyToken, auth.isTecnico], repuestoController.getReclamo);
router.post('/getFoto', [auth.verifyToken, auth.isTecnico], repuestoController.getFoto);
router.get('/downloadFoto', [auth.verifyToken, auth.isTecnico], repuestoController.downloadFoto);

module.exports = router;
