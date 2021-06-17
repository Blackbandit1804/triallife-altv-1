import express from 'express';
import Logger from '../../utility/tlrp-logger';

const router = express.Router();

router.get('/discord', (req, res) => {
    Logger.warning(`/api/post/discord: ${JSON.stringify(req.query)}`);
});

export default router;
