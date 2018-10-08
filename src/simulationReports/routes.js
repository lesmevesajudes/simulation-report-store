import {getSimulationReport, getAllSimulationReports, createSimulationReport} from './simulationReportsRequests';
import {Router} from 'express';

const router = Router();


router.get('/simulation_reports/:id', getSimulationReport);
router.get('/simulation_reports/', getAllSimulationReports);
router.post('/simulation_reports/', createSimulationReport);

export default router;
