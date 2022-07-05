var express = require('express');
var auth = require('../../middlewares/auth');
var proformaController = require('../../controllers/administrativo/repuestoController');
var router = express.Router();

router.post('/getRepuesto', [auth.verifyToken, auth.isAdministrativo], proformaController.getRepuesto);
router.post('/getRepuestoArchivado', [auth.verifyToken, auth.isAdministrativo], proformaController.getRepuestoArchivado);
router.post('/insRepuesto', [auth.verifyToken, auth.isAdministrativo], proformaController.insRepuesto);
router.post('/insOrUpdCliente', [auth.verifyToken, auth.isAdministrativo], proformaController.insOrUpdCliente);
router.post('/getReclamo', [auth.verifyToken, auth.isAdministrativo], proformaController.getReclamo);
router.post('/archivarRepuesto', [auth.verifyToken, auth.isAdministrativo], proformaController.archivarRepuesto);
router.post('/desarchivarRepuesto', [auth.verifyToken, auth.isAdministrativo], proformaController.desarchivarRepuesto);

module.exports = router;
