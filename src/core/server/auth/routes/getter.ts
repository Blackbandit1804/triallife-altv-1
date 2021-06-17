import { Router } from 'express';
import Logger from '../../utility/tlrp-logger';

const router = Router();

router.get('/discord', (req, res) => {
    Logger.warning(`/api/get/key: ${JSON.stringify(req.query)}`);
});

export default router;
