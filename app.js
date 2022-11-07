const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./bots/botTelegram');
//const cron = require('node-cron');
//const botWhatsApp = require('./bots/botWhatsApp');

const Estado = require('./models/Estado');

const roleController = require('./controllers/administrativo/roleController');
const estadoController = require('./controllers/administrativo/estadoController');

const indexRouter = require('./routes/index');

const renderAdministrativoRouter = require('./routes/administrativo/render');
const reclamoAdministrativoRouter = require('./routes/administrativo/reclamo');
const tecnicoAdministrativoRouter = require('./routes/administrativo/tecnico');
const administrativoAdministrativoRouter = require('./routes/administrativo/administrativo');
const productoAdministrativoRouter = require('./routes/administrativo/producto');
const planillaAdministrativoRouter = require('./routes/administrativo/planilla');
const repuestoAdministrativoRouter = require('./routes/administrativo/repuesto');

const renderTecnicoRouter = require('./routes/tecnico/render');
const reclamoTecnicoRouter = require('./routes/tecnico/reclamo');
const proformaTecnicoRouter = require('./routes/tecnico/proforma');
const planillaTecnicoRouter = require('./routes/tecnico/planilla');
const repuestoTecnicoRouter = require('./routes/tecnico/repuesto');

const dotenv = require('dotenv');

const app = express();
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
app.use('/administrativo-administrativo', administrativoAdministrativoRouter);
app.use('/administrativo-producto', productoAdministrativoRouter);
app.use('/administrativo-planilla', planillaAdministrativoRouter);
app.use('/administrativo-repuesto', repuestoAdministrativoRouter);

app.use('/tecnico', renderTecnicoRouter);
app.use('/tecnico-reclamo', reclamoTecnicoRouter);
app.use('/tecnico-proforma', proformaTecnicoRouter);
app.use('/tecnico-planilla', planillaTecnicoRouter);
app.use('/tecnico-repuesto', repuestoTecnicoRouter);
/*
cron.schedule('0,10,20,30,40,50 * * * *', async () => {
  const searchEstados = await Estado.findOne();
  console.log(searchEstados);
});*/

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
