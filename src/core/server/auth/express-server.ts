import * as alt from 'alt-server';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import path from 'path';
import Logger from '../utility/tlrp-logger';
import { LoginManager } from '../systems/login';
import { getPublicKey } from '../utility/encryption';

const app = express();
app.use(cors());

app.get('/v1/get/version', (req, res) => res.send('1.0.0'));
app.get('/v1/get/key', async (req, res) => res.send(JSON.stringify({ status: true, key: getPublicKey() })));

app.listen(7800, () => Logger.info('Authentication service listen on port 7800'));
