var express = require('express');
var loginController = require('../controllers/loginController');
var auth = require('../middlewares/auth');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { alert: false });
});

router.get('/login', auth.verifyTokenLogin, function(req, res) {
  res.render('login', { alert: false });
});

router.get('/reclamo', function(req, res) {
  res.render('reclamo');
});

router.get('/comprimirImagen', function(req, res) {
  res.render('comprimirImagen');
});

router.post('/login', loginController.login);
router.get('/logout', loginController.logout);

module.exports = router;
