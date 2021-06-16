import express from 'express';
import cors from 'cors';
import Logger from '../utility/tlrp-logger';
import { getPublicKey } from '../utility/encryption';

const app = express();
app.use(cors());

app.get('/v1/get/key', async (req, res) => res.send(JSON.stringify({ status: true, key: getPublicKey() })));

app.listen(7800, () => Logger.info('Authentication service listen on port 7800'));
