import express from 'express';
import {login} from './authenticationRequests';
import {getSimulationReport, getAllSimulationReports, createSimulationReport} from "./simulationReportsRequests";

const router = express.Router();

router.get('/', function (req, res, next) {
  res.status(200)
      .json({
        status: 'success',
        message: 'Live long and prosper!'
      });
});

router.get('/api/simulation_reports/:id', getSimulationReport);
router.get('/api/simulation_reports', getAllSimulationReports);
router.post('/api/simulation_reports', createSimulationReport);
router.post('/api/simulation_reports', login);

export default router;
