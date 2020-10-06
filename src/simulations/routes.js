import {getSimulation, getAllSimulations, createSimulation, updateSimulation, showAllSimulations, getAllResults} from './simulationsRequests';
import {Router} from 'express';

const router = Router();

router.get('/results', getAllResults);
router.get('/:id', getSimulation);
router.get('/', getAllSimulations);
router.post('/', createSimulation);

//router.get('/all/view', showAllSimulations);

export default router;
