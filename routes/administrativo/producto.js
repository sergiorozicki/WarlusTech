var express = require('express');
var auth = require('../../middlewares/auth');
var productoController = require('../../controllers/administrativo/productoController');
var router = express.Router();

router.post('/getProducto', [auth.verifyToken, auth.isAdministrativo], productoController.getProducto);
router.post('/getProductoArchivado', [auth.verifyToken, auth.isAdministrativo], productoController.getProductoArchivado);
router.post('/insProducto', [auth.verifyToken, auth.isAdministrativo], productoController.insProducto);
router.post('/insModelo', [auth.verifyToken, auth.isAdministrativo], productoController.insModelo);
router.post('/updModelo', [auth.verifyToken, auth.isAdministrativo], productoController.updModelo);
router.post('/updProducto', [auth.verifyToken, auth.isAdministrativo], productoController.updProducto);
router.post('/archivarProducto', [auth.verifyToken, auth.isAdministrativo], productoController.archivarProducto);
router.post('/desarchivarProducto', [auth.verifyToken, auth.isAdministrativo], productoController.desarchivarProducto);
router.post('/archivarModelo', [auth.verifyToken, auth.isAdministrativo], productoController.archivarModelo);
router.post('/desarchivarModelo', [auth.verifyToken, auth.isAdministrativo], productoController.desarchivarModelo);

module.exports = router;