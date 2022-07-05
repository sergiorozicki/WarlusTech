var express = require('express');
var auth = require('../../middlewares/auth');
var productoController = require('../../controllers/administrativo/productoController');
var router = express.Router();

router.post('/getProducto', [auth.verifyToken, auth.isAdministrativo], productoController.getProducto);
router.post('/getProductoArchivado', [auth.verifyToken, auth.isAdministrativo], productoController.getProductoArchivado);
router.post('/insProducto', [auth.verifyToken, auth.isAdministrativo], productoController.insProducto);
router.post('/updProducto', [auth.verifyToken, auth.isAdministrativo], productoController.updProducto);
router.post('/archivarProducto', [auth.verifyToken, auth.isAdministrativo], productoController.archivarProducto);
router.post('/desarchivarProducto', [auth.verifyToken, auth.isAdministrativo], productoController.desarchivarProducto);

module.exports = router;