var express = require('express');
var auth = require('../../middlewares/auth');
var reclamoController = require('../../controllers/tecnico/reclamoController');
var router = express.Router();

router.post('/getReclamo', [auth.verifyToken, auth.isTecnico], reclamoController.getReclamo);
router.post('/getReclamoArchivado', [auth.verifyToken, auth.isTecnico], reclamoController.getReclamoArchivado);
router.post('/getEstado', [auth.verifyToken, auth.isTecnico], reclamoController.getEstado);
router.post('/archivarReclamo', [auth.verifyToken, auth.isTecnico], reclamoController.archivarReclamo);
router.post('/getFoto', [auth.verifyToken, auth.isTecnico], reclamoController.getFoto);
router.get('/downloadFoto', [auth.verifyToken, auth.isTecnico], reclamoController.downloadFoto);

module.exports = router;
