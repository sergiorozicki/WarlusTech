var express = require('express');
var auth = require('../../middlewares/auth');
var planillaController = require('../../controllers/tecnico/planillaController');
var router = express.Router();


router.post('/insPlanilla', [auth.verifyToken, auth.isTecnico], planillaController.insPlanilla);
router.post('/getPlanillaPendiente', [auth.verifyToken, auth.isTecnico], planillaController.getPlanillaPendiente);
router.get('/downloadPlanilla', [auth.verifyToken, auth.isTecnico], planillaController.downloadPlanilla);
router.post('/getPlanillaArchivada', [auth.verifyToken, auth.isTecnico], planillaController.getPlanillaArchivada);
router.post('/archivarPlanilla', [auth.verifyToken, auth.isTecnico], planillaController.archivarPlanilla);

module.exports = router;