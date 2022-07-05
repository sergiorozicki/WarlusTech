var express = require('express');
var auth = require('../../middlewares/auth');
var reclamoController = require('../../controllers/tecnico/reclamoController');
var router = express.Router();

router.post('/getReclamo', [auth.verifyToken, auth.isTecnico], reclamoController.getReclamo);
router.post('/getEstado', [auth.verifyToken, auth.isTecnico], reclamoController.getEstado);

module.exports = router;
