import { Router } from 'express';
import request from './requester';
import gettter from './getter';
import poster from './poster';

const router = Router();

router.use('/request', request);
router.use('/get', gettter);
router.use('/post', poster);

export default router;
