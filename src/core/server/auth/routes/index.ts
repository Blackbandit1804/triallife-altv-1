import express from 'express';
import request from './requester.js';
import getter from './getter.js';
import poster from './poster.js';

const router = express.Router();

router.use('/request', request);
router.use('/get', getter);
router.use('/post', poster);

export default router;
