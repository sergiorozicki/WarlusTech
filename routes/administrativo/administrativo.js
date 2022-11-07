var express = require('express');
var auth = require('../../middlewares/auth');
var administrativoController = require('../../controllers/administrativo/administrativoController');
var router = express.Router();

router.post('/getAdministrativo', [auth.verifyToken, auth.isAdministrativo], administrativoController.getAdministrativo);
router.post('/getAdministrativoArchivado', [auth.verifyToken, auth.isAdministrativo], administrativoController.getAdministrativoArchivado);
router.post('/insAdministrativo', [auth.verifyToken, auth.isAdministrativo], administrativoController.insAdministrativo);
router.post('/updAdministrativo', [auth.verifyToken, auth.isAdministrativo], administrativoController.updAdministrativo);
router.post('/archivarAdministrativo', [auth.verifyToken, auth.isAdministrativo], administrativoController.archivarAdministrativo);
router.post('/desarchivarAdministrativo', [auth.verifyToken, auth.isAdministrativo], administrativoController.desarchivarAdministrativo);

module.exports = router;
