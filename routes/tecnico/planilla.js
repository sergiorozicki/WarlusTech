var express = require('express');
var auth = require('../../middlewares/auth');
var planilla = require('../../controllers/tecnico/planillaController');
var router = express.Router();


router.post('/insPlanilla', [auth.verifyToken, auth.isTecnico], planilla.insPlanilla);
router.post('/getPlanillaPendiente', [auth.verifyToken, auth.isTecnico], planilla.getPlanillaPendiente);
router.get('/downloadPlanilla', [auth.verifyToken, auth.isTecnico], planilla.downloadPlanilla);
router.post('/getPlanillaArchivada', [auth.verifyToken, auth.isTecnico], planilla.getPlanillaArchivada);
router.post('/archivarPlanilla', [auth.verifyToken, auth.isTecnico], planilla.archivarPlanilla);
router.post('/desarchivarPlanilla', [auth.verifyToken, auth.isTecnico], planilla.desarchivarPlanilla);

module.exports = router;