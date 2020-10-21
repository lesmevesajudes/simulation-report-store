import {getAll} from './dashboardRequests';
import {Router} from 'express';

const router = Router();

router.get('/', getAll);

export default router;
