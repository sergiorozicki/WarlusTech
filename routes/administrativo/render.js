var express = require('express');
var auth = require('../../middlewares/auth');
var router = express.Router();

router.get('/', [auth.verifyToken, auth.isAdministrativo], function(req, res) {
  res.render('administrativo/reclamo');
});

router.get('/reclamo', [auth.verifyToken, auth.isAdministrativo], function(req, res) {
  res.render('administrativo/reclamo');
});

router.get('/tecnico', [auth.verifyToken, auth.isAdministrativo], function(req, res) {
  res.render('administrativo/tecnico');
});

router.get('/producto', [auth.verifyToken, auth.isAdministrativo], function(req, res) {
    res.render('administrativo/producto');
});

router.get('/administrativo', [auth.verifyToken, auth.isAdministrativo], function(req, res) {
    res.render('administrativo/administrativo');
});

router.get('/repuesto', [auth.verifyToken, auth.isAdministrativo], function(req, res) {
    res.render('administrativo/repuesto');
});

router.get('/planilla', [auth.verifyToken, auth.isAdministrativo], function(req, res) {
    res.render('administrativo/planilla');
});

router.get('/estadistica', [auth.verifyToken, auth.isAdministrativo], function(req, res) {
    res.render('administrativo/estadistica');
});

module.exports = router;