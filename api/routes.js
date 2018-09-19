var express = require('express');
var router = express.Router();

var simulationAPI = require('./simulationRequests');
var authenticationAPI = require('./authenticationRequests');



router.get('/', function (req, res, next) {
  res.status(200)
      .json({
        status: 'success',
        message: 'Live long and prosper!'
      });
});

router.get('/api/simulations/:id', simulationAPI.getSimulation);
router.get('/api/simulations/', simulationAPI.getAllSimulations);
router.post('/api/simulations', simulationAPI.createSimulation);
router.post('/api/authenticate', authenticationAPI.login);

module.exports = router;
