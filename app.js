var createError = require('http-errors');
var express = require('express');
var path = require('path');

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/api/usuarios');
var imagenesRouter = require('./routes/api/imagenes');
var materiasRouter = require('./routes/api/materias');
var cursosRouter = require('./routes/api/cursos');
var integrantesRouter = require('./routes/api/integrantes');
var guiasRouter = require('./routes/api/guias');
var preguntasRouter = require('./routes/api/preguntas');
var laboratoriosRouter = require('./routes/api/laboratorios');
var respuestasRouter = require('./routes/api/respuestas');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");//el host del que se permitiran las peticiones 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, PATCH,OPTIONS');
  //next();
  //Las peticiones de tipo OPTIONS son mandadas automáticamente por el navegador para comprobas cuales son las cabeceras que van a enviarse, por tanto si la petición es de tipo 'OPTIONS', no ejecutaremos más middelwares porque sólo queríamos comprobar las cabeceras. Si no es de tipo OPTIONS, continuamos con el siguiente MIDDLEWARE
  if(req.method === 'OPTIONS') {
    res.send('Success');
  } else {
      next();
  }
});
/*app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, access-token');

  //Las peticiones de tipo OPTIONS son mandadas automáticamente por el navegador para comprobas cuales son las cabeceras que van a enviarse, por tanto si la petición es de tipo 'OPTIONS', no ejecutaremos más middelwares porque sólo queríamos comprobar las cabeceras. Si no es de tipo OPTIONS, continuamos con el siguiente MIDDLEWARE
  if(req.method === 'OPTIONS') {
      res.send('Success');
  } else {
      next();
  }
});*/


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/imagenes', imagenesRouter);
app.use('/api/materias', materiasRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/integrantes', integrantesRouter);
app.use('/api/guias', guiasRouter);
app.use('/api/preguntas', preguntasRouter);
app.use('/api/laboratorios', laboratoriosRouter);
app.use('/api/respuestas', respuestasRouter);



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
  //res.render('error');
  res.json({error: err.message})
});

const port = 8000;
app.listen(port, ()=>{
    console.log('Servidor escuchando en el puerto ' + port);
});



module.exports = app;
