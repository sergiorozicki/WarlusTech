var express = require('express');
var auth = require('../../middlewares/auth');
var repuestoController = require('../../controllers/administrativo/repuestoController');
var router = express.Router();

router.post('/getRepuesto', [auth.verifyToken, auth.isAdministrativo], repuestoController.getRepuesto);
router.post('/getRepuestoArchivado', [auth.verifyToken, auth.isAdministrativo], repuestoController.getRepuestoArchivado);
router.post('/insRepuesto', [auth.verifyToken, auth.isAdministrativo], repuestoController.insRepuesto);
router.post('/getReclamo', [auth.verifyToken, auth.isAdministrativo], repuestoController.getReclamo);
router.post('/archivarRepuesto', [auth.verifyToken, auth.isAdministrativo], repuestoController.archivarRepuesto);
router.post('/desarchivarRepuesto', [auth.verifyToken, auth.isAdministrativo], repuestoController.desarchivarRepuesto);
router.post('/getFoto', [auth.verifyToken, auth.isAdministrativo], repuestoController.getFoto);
router.get('/downloadFoto', [auth.verifyToken, auth.isAdministrativo], repuestoController.downloadFoto);

module.exports = router;
