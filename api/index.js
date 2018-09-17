var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.status(200)
      .json({
        status: 'success',
        message: 'Live long and prosper!'
      });
});

var db = require('./queries');
var auth = require('./authentication');

router.get('/api/simulations/:id', db.getSimulation);
router.get('/api/simulations/', db.getAllSimulations);
router.post('/api/simulations', db.createSimulation);
router.post('/api/authenticate', auth.login);

module.exports = router;
