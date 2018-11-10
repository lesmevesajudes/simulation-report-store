import {getSimulation, getAllSimulations, createSimulation} from './simulationsRequests';
import {Router} from 'express';

const router = Router();


router.get('/:id', getSimulation);
router.get('/', getAllSimulations);
router.post('/', createSimulation);

export default router;
