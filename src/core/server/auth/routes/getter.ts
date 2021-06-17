import express from 'express';
import Logger from '../../utility/tlrp-logger';

const router = express.Router();

router.get('/discord', (req, res) => {
    Logger.warning(`/api/get/key: ${JSON.stringify(req.query)}`);
});

export default router;
