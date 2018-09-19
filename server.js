var express = require('express');
var config = require('./config.js');
var logger = require('morgan');
var bodyParser = require('body-parser');

var api = require('./api/routes');

var app = express();


///////////////////////
// Server Middleware
///////////////////////

app.use(logger(app.get("env") === "production" ? "combined" : "dev"));

// parse application/json
app.use(bodyParser.json());

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// CORS
// This allows client applications from other domains use the API Server
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Total-Count, Content-Range, authentication-token, Access-Control-Allow-Headers");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Total-Count, Content-Range, authentication-token, Access-Control-Allow-Headers");
  next();
});


//////////////////
// API Queries
//////////////////

app.use('/', api);


//////////////////
// Server Setup
//////////////////

app.set("env", config.ENVIRONMENT);
app.set("host", config.LISTEN_HOST);
app.set("port", config.LISTEN_PORT);

app.listen(app.get("port"), function () {
  console.log('\n' + '**********************************');
  console.log('REST API listening on port ' + app.get("port").toString() + ' environment: ' + app.get('env'));
  console.log('**********************************' + '\n');
});


////////////////////
// Error Handlers
////////////////////

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });

});


module.exports = app;
