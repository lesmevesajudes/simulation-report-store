import {login} from './authenticationRequests';
import {Router} from 'express';

const router = Router();
export default router.post('/authenticate', login);
