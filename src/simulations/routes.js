import {getSimulation, getAllSimulations, createSimulation, updateSimulation, showAllSimulations} from './simulationsRequests';
import {Router} from 'express';

const router = Router();


router.get('/:id', getSimulation);
router.get('/', getAllSimulations);
router.post('/', createSimulation);
router.post('/:id', updateSimulation);


router.get('/all/view', showAllSimulations);

export default router;
