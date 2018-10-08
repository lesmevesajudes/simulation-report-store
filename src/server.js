import express, {Router} from 'express';
import logger  from 'morgan';
import bodyParser from 'body-parser';
import authenticationRoutes from './authentication/routes';
import simulationReportsRoutes from "./simulationReports/routes";

const app = express();


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
const rootRouter = Router();
rootRouter.get('/', function (req, res, next) {
  res.status(200)
      .json({
        status: 'success',
        message: 'Live long and prosper!'
      });
});
app.use ('/', rootRouter);
app.use('/api/simulation_reports', simulationReportsRoutes);
app.use('/api/authentication', authenticationRoutes);


//////////////////
// Server Setup
//////////////////


////////////////////
// Error Handlers
////////////////////

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
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

app.run = (host, port, env) => {
  app.set("env", env );
  app.set("host", host);
  app.set("port", port);

  app.listen(port, function () {
    console.info(`⭐️ REST API listening on ${host}:${port.toString()} environment: ${env}`);
  });
};

export default app;
