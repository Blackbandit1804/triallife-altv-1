import * as alt from 'alt-server';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import Logger from '../utility/tlrp-logger';

const app = express();
app.use(cors());
app.get('/api/request/key', (req, res) => {
    const token = req.query.code;
    const userToken = req.query.state;
});

//app.listen(7800, () => Logger.info(`starting discord authentication service on port 7800`));
