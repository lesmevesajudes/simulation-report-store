import {getSimulationReport, getAllSimulationReports, createSimulationReport} from './simulationReportsRequests';
import {Router} from 'express';

const router = Router();


router.get('/:id', getSimulationReport);
router.get('/', getAllSimulationReports);
router.post('/', createSimulationReport);

export default router;
