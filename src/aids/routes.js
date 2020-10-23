import {getAll} from './aidRequests';
import {Router} from 'express';

const router = Router();

router.get('/', getAll);

export default router;
