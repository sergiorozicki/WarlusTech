var express = require('express');
var auth = require('../../middlewares/auth');
var reclamoController = require('../../controllers/administrativo/reclamoController');
var router = express.Router();

router.post('/getReclamoEnEspera', [auth.verifyToken, auth.isAdministrativo], reclamoController.getReclamoEnEspera);
router.post('/getReclamoAceptado', [auth.verifyToken, auth.isAdministrativo], reclamoController.getReclamoAceptado);
router.post('/getReclamoArchivado', [auth.verifyToken, auth.isAdministrativo], reclamoController.getReclamoArchivado);
router.post('/delReclamo', [auth.verifyToken, auth.isAdministrativo], reclamoController.delReclamo);
router.post('/getTecnico', [auth.verifyToken, auth.isAdministrativo], reclamoController.getTecnico);
router.post('/getEstado', [auth.verifyToken, auth.isAdministrativo], reclamoController.getEstado);
router.post('/getSeguimientoPorId', [auth.verifyToken, auth.isAdministrativo], reclamoController.getSeguimientoPorId);
router.post('/archivarReclamo', [auth.verifyToken, auth.isAdministrativo], reclamoController.archivarReclamo);
router.post('/desarchivarReclamo', [auth.verifyToken, auth.isAdministrativo], reclamoController.desarchivarReclamo);
router.post('/asignarTecnico', [auth.verifyToken, auth.isAdministrativo], reclamoController.asignarTecnico);
router.post('/insOrUpdCliente', reclamoController.insOrUpdCliente);
router.post('/getCliente', reclamoController.getCliente);
router.post('/getProducto', reclamoController.getProducto);
router.post('/getSeguimientoPorDni', reclamoController.getSeguimientoPorDni);
router.post('/getFoto', [auth.verifyToken, auth.isAdministrativo], reclamoController.getFoto);
router.get('/downloadFoto', [auth.verifyToken, auth.isAdministrativo], reclamoController.downloadFoto);

module.exports = router;
