var express = require('express');
var auth = require('../../middlewares/auth');
var planillaController = require('../../controllers/administrativo/planillaController');
var router = express.Router();

router.post('/getPlanillaPendiente', [auth.verifyToken, auth.isAdministrativo], planillaController.getPlanillaPendiente);
router.get('/downloadPlanillaPendiente', [auth.verifyToken, auth.isAdministrativo], planillaController.downloadPlanillaPendiente);
router.post('/getPlanillaArchivada', [auth.verifyToken, auth.isAdministrativo], planillaController.getPlanillaArchivada);
router.get('/downloadPlanillaArchivada', [auth.verifyToken, auth.isAdministrativo], planillaController.downloadPlanillaArchivada);
router.post('/desarchivarPlanilla', [auth.verifyToken, auth.isAdministrativo], planillaController.desarchivarPlanilla);

module.exports = router;