var express = require('express');
var auth = require('../../middlewares/auth');
var router = express.Router();

router.get('/reclamo', [auth.verifyToken, auth.isTecnico], function(req, res) {
  res.render('tecnico/reclamo');
});

router.get('/', [auth.verifyToken, auth.isTecnico], function(req, res) {
  res.render('tecnico/home');
});

router.get('/proforma', [auth.verifyToken, auth.isTecnico], function(req, res) {
  res.render('tecnico/proforma');
});

router.get('/repuesto', [auth.verifyToken, auth.isTecnico], function(req, res) {
  res.render('tecnico/repuesto');
});

router.get('/planilla', [auth.verifyToken, auth.isTecnico], function(req, res) {
  res.render('tecnico/planilla');
});

router.get('/planilla-archivada', [auth.verifyToken, auth.isTecnico], function(req, res) {
  res.render('tecnico/planillaArchivada');
});

module.exports = router;