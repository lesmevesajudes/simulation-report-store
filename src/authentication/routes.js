import {login, validateDashboardAccess} from './authenticationRequests';
import {Router} from 'express';

const router = Router();
router.post('/', login);
router.post('/dashboard-code', validateDashboardAccess);

export default router;
