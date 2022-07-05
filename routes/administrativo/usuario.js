var express = require('express');
var auth = require('../../middlewares/auth');
var usuarioController = require('../../controllers/administrativo/usuarioController');
var router = express.Router();

router.post('/getUsuario', [auth.verifyToken, auth.isAdministrativo], usuarioController.getUsuario);
router.post('/getUsuarioArchivado', [auth.verifyToken, auth.isAdministrativo], usuarioController.getUsuarioArchivado);
router.post('/insUsuario', [auth.verifyToken, auth.isAdministrativo], usuarioController.insUsuario);
router.post('/updUsuario', [auth.verifyToken, auth.isAdministrativo], usuarioController.updUsuario);
router.post('/archivarUsuario', [auth.verifyToken, auth.isAdministrativo], usuarioController.archivarUsuario);
router.post('/desarchivarUsuario', [auth.verifyToken, auth.isAdministrativo], usuarioController.desarchivarUsuario);
router.post('/getRole', [auth.verifyToken, auth.isAdministrativo], usuarioController.getRole);

module.exports = router;
