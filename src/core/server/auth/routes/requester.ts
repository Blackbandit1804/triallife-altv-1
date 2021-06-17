import express from 'express';
import Logger from '../../utility/tlrp-logger';

const router = express.Router();

router.get('/key', async (req, res) => {
    const token = req.query.code;
    const crypted = req.query.state;
    if (!token) return;
    Logger.warning(`/api/request/key: ${JSON.stringify(req.query)}`);
});

export default router;
