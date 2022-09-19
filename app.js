const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2');
const hbs = require('hbs');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 8080;

const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

conexion.connect((err) => {
    if (err) {
        console.error(`Error en la conexión: ${err.stack}`)
        return;
    }
    console.log(`Conectado a la Base de Datos ${process.env.DATABASE}`);
});

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/', (req,res)=> {
  res.render('index')
});

app.get('/features', (req,res)=> {
  res.render('features')
});

app.get('/plans', (req,res)=> {
  res.render('plans')
});

app.get('/request', (req, res) => {
  let sql = 'SELECT * FROM clientes';

      conexion.query(sql, (err, result) => {
          if (err) throw err;
          res.render('request', {
              titulo: 'Listado de productos', 
              results: result,
      });
  });
});

app.post('/request', (req, res) => {
      const { nombre, provincia, plan } = req.body;
  
      if (nombre == '' || provincia == '' || plan == '') {
          let validacion = 'Rellene los campos correctamente...';
          res.render('request', {
              validacion
          });
      } else {
  
          let datos = {
              nombre: nombre, 
              provincia: provincia,
              plan: plan
          };
  
          let sql = 'INSERT INTO clientes SET ?';
  
          conexion.query(sql, datos, (err, result) => {
              if (err) throw err;
              res.render('request', {
              });
          });
      }
  });

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

app.listen(PORT, () => {
  console.log(`El servidor está trabajando en el Puerto ${PORT}`);
});