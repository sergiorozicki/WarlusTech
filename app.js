var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var botTelegram = require('./bots/botTelegram');
//var botWhatsApp = require('./bots/botWhatsApp');

var roleController = require('./controllers/administrativo/roleController');
var estadoController = require('./controllers/administrativo/estadoController');

var indexRouter = require('./routes/index');

var renderAdministrativoRouter = require('./routes/administrativo/render');
var reclamoAdministrativoRouter = require('./routes/administrativo/reclamo');
var tecnicoAdministrativoRouter = require('./routes/administrativo/tecnico');
var productoAdministrativoRouter = require('./routes/administrativo/producto');
var usuarioAdministrativoRouter = require('./routes/administrativo/usuario');
var planillaAdministrativoRouter = require('./routes/administrativo/planilla');
var repuestoAdministrativoRouter = require('./routes/administrativo/repuesto');

var renderTecnicoRouter = require('./routes/tecnico/render');
var reclamoTecnicoRouter = require('./routes/tecnico/reclamo');
var proformaTecnicoRouter = require('./routes/tecnico/proforma');
var planillaTecnicoRouter = require('./routes/tecnico/planilla');
var repuestoTecnicoRouter = require('./routes/tecnico/repuesto');

var dotenv = require('dotenv');

var app = express();
//roleController.createRoles();
//estadoController.createEstado();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//para las variables de entorno, archivo ".env"
dotenv.config({path: './.env'});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Para eliminar la cache 
app.use(function(req, res, next) {
  if (!req.user){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  }
  next();
});

app.use('/', indexRouter);

app.use('/administrativo', renderAdministrativoRouter);
app.use('/administrativo-reclamo', reclamoAdministrativoRouter);
app.use('/administrativo-tecnico', tecnicoAdministrativoRouter);
app.use('/administrativo-producto', productoAdministrativoRouter);
app.use('/administrativo-usuario', usuarioAdministrativoRouter);
app.use('/administrativo-planilla', planillaAdministrativoRouter);
app.use('/administrativo-repuesto', repuestoAdministrativoRouter);

app.use('/tecnico', renderTecnicoRouter);
app.use('/tecnico-reclamo', reclamoTecnicoRouter);
app.use('/tecnico-proforma', proformaTecnicoRouter);
app.use('/tecnico-planilla', planillaTecnicoRouter);
app.use('/tecnico-repuesto', repuestoTecnicoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
