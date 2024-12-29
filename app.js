var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('server:app');

var indexRouter = require('./routes/index');
var standardTableRouter = require('./routes/standardTable');

const { sequelize, testConnection } = require('./bin/db');  // Import the testConnection function

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//route all paths containing only letters and numbers to some table
app.use('/', standardTableRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));  // This triggers the error handler for 404
});
testConnection();
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
