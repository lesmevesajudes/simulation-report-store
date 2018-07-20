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

router.get('/api/simulations/', db.getAllSimulations);
router.get('/api/simulations/:id', db.getSimulation);
router.post('/api/simulations', db.createSimulation);

module.exports = router;
