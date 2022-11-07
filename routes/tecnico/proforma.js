var express = require('express');
var auth = require('../../middlewares/auth');
var proformaController = require('../../controllers/tecnico/proformaController');
var router = express.Router();

router.post('/getProforma', [auth.verifyToken, auth.isTecnico], proformaController.getProforma);
router.post('/getCliente', [auth.verifyToken, auth.isTecnico], proformaController.getCliente);
router.post('/insOrUpdCliente', [auth.verifyToken, auth.isTecnico], proformaController.insOrUpdCliente);
router.post('/getProducto', [auth.verifyToken, auth.isTecnico], proformaController.getProducto);
router.post('/insLogo', [auth.verifyToken, auth.isTecnico], proformaController.insLogo);

module.exports = router;
