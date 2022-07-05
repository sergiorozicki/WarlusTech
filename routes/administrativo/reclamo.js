var express = require('express');
var auth = require('../../middlewares/auth');
var reclamoController = require('../../controllers/administrativo/reclamoController');
var router = express.Router();

router.post('/insCliente', [auth.verifyToken, auth.isAdministrativo], reclamoController.insCliente);
router.post('/updCliente', [auth.verifyToken, auth.isAdministrativo], reclamoController.updCliente);
router.post('/getReclamo', [auth.verifyToken, auth.isAdministrativo], reclamoController.getReclamo);
router.post('/insOrUpdCliente', reclamoController.insOrUpdCliente);
router.post('/getTecnico', [auth.verifyToken, auth.isAdministrativo], reclamoController.getTecnico);
router.post('/getCliente', reclamoController.getCliente);
router.post('/getEstado', reclamoController.getEstado);

module.exports = router;
