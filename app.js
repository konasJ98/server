var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); //http logging
const chalk = require('chalk'); //colorized console output
var debug = require('debug')('server:app');
const listEndpoints = require('express-list-endpoints');

var indexRouter = require('./routes/index');
var standardTableRouter = require('./routes/standardTable');

const Json5Database = require('./bin/JsonDatabase.js');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Logging with Morgan
// Custom stream for custom prefix
const customStream = {
  write: (message) => {
    console.log(chalk.yellow('LOG:'), message.trim());
  },
};
app.use(logger('dev', {  stream: customStream  }));

app.use(express.json()); //automatically parses json in req body
app.use(express.text()); //parsing text in req.body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//front page
app.use('/', indexRouter);

//handly any doc
app.use('/', standardTableRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));  // This triggers the error handler for 404
});

p = new Json5Database('asdf');

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function listRoutes(app) {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Route detected
      routes.push(middleware.route);
    } else if (middleware.name === 'router') {
      // Router detected
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push(handler.route);
        }
      });
    }
  });
  console.log('Registered Routes:', routes);
}

//listRoutes(app);
//console.log('Endpoints:');
//console.log(listEndpoints(app));

module.exports = app;
