import express, {Router} from 'express';
import logger  from 'morgan';
import bodyParser from 'body-parser';
import authenticationRoutes from './authentication/routes';
import simulationReportsRoutes from './simulationReports/routes';
import simulationsRoutes from './simulations/routes';
import dashboardRoutes from './dashboard/routes';

const app = express();
const isProduction  = app.get('env') === 'production';

///////////////////////
// Server Middleware
///////////////////////

app.use(logger(isProduction ? 'combined' : 'dev'));

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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Expose-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Total-Count, Content-Range, authentication-token, Access-Control-Allow-Headers');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Total-Count, Content-Range, authentication-token, Access-Control-Allow-Headers');
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
app.use('/api/simulations', simulationsRoutes);
app.use('/api/authenticate', authenticationRoutes);
app.use('/api/dashboard', dashboardRoutes);


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

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500);
  err.status || console.error(err.message);
  res.json({
    message: 'Internal error'
  });

});


// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    err.status || console.error(err);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });

  });
}

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.run = (host, port, env) => {
  console.log(port);
  app.set('env', env );
  app.set('host', host);
  app.set('port', port);

  app.listen(port, function () {
    console.info(`⭐️ REST API listening on ${host}:${port.toString()} environment: ${env}`);
  });
};

export default app;
