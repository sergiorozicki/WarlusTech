var express = require('express');
var auth = require('../../middlewares/auth');
var tecnicoController = require('../../controllers/administrativo/tecnicoController');
var router = express.Router();

router.post('/getTecnico', [auth.verifyToken, auth.isAdministrativo], tecnicoController.getTecnico);
router.post('/getTecnicoArchivado', [auth.verifyToken, auth.isAdministrativo], tecnicoController.getTecnicoArchivado);
router.post('/insTecnico', [auth.verifyToken, auth.isAdministrativo], tecnicoController.insTecnico);
router.post('/updTecnico', [auth.verifyToken, auth.isAdministrativo], tecnicoController.updTecnico);
router.post('/archivarTecnico', [auth.verifyToken, auth.isAdministrativo], tecnicoController.archivarTecnico);
router.post('/desarchivarTecnico', [auth.verifyToken, auth.isAdministrativo], tecnicoController.desarchivarTecnico);
router.post('/getEstado', [auth.verifyToken, auth.isAdministrativo], tecnicoController.getEstado);
router.post('/getUsuario', [auth.verifyToken, auth.isAdministrativo], tecnicoController.getUsuario);

router.get('/getTecnico', tecnicoController.getTecnico);

module.exports = router;
