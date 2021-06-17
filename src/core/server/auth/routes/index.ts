import express from 'express';
import request from './requester';
import getter from './getter';
import poster from './poster';

const router = express.Router();

router.use('/request', request);
router.use('/get', getter);
router.use('/post', poster);

export default router;
