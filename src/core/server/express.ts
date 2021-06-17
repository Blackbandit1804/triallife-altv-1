import * as alt from 'alt-server';
import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Logger from './utility/tlrp-logger';

dotenv.config();

const app = express();
app.use(cors());

app.get('/api/request/key', async (req, res) => {
    const token = req.query.code;
    const userToken = req.query.state;
    let request;
    if (!token || !userToken) {
        res.sendStatus(400);
        return;
    }
    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env.CLIENT_ID);
    authParams.append(`client_secret`, process.env.CLIENT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `${process.env.ENDPOINT}/api/request/key`);
    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) {
        res.sendStatus(400);
        return;
    }
    const discordData = { ...request.data };
    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${discordData.token_type} ${discordData.access_token}` }
    });
    if (!request.data || !request.data.id || !request.data.username) {
        res.sendStatus(400);
        return;
    }
    const player = [...alt.Player.all].find((player) => player.discordToken === userToken);
    if (!player || !player.valid) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

app.listen(7800, () => Logger.passed(`starting discord authentication service on port 7800`));
