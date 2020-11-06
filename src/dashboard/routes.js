import {getAll, countEditedSimulations} from './dashboardRequests';
import {Router} from 'express';

const router = Router();

router.get('/', getAll);
router.get('/count/edited', countEditedSimulations);

export default router;
