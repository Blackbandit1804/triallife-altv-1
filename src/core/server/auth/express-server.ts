import * as alt from 'alt-server';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import path from 'path';
import Logger from '../utility/tlrp-logger';
import { LoginManager } from '../systems/login';
import { getSharedSecret } from '../utility/encryption';

const app = express();
app.use(cors());
app.get('/v1/request/key', async (req, res) => {
    const token = req.query.code;
    const userToken = req.query.state;
    let request;
    if (!token || !userToken) {
        res.redirect('/v1/request/key');
        return;
    }
    const player = [...alt.Player.all].find((player) => player.discordToken === userToken);
    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env['CLIENT_ID']);
    authParams.append(`client_secret`, process.env['CLIENT_SECRET']);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `http://${process.env.ENDPOINT}/v1/request/key`);
    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) {
        player.emit('Discord:Fail', 'Could not communicate with Authorization service.');
        return;
    }
});

app.get('/v1/get/version', (req, res) => res.send('1.0.0'));
app.get('/v1/get/key', async (req, res) => res.send(JSON.stringify({ status: true, key: await getSharedSecret() })));

app.get('/v1/post/discord', async (req, res) => {
    const data = { ...req.data };
    const request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${data.token_type} ${data.access_token}` }
    });
    if (!request.data || !request.data.id || !request.data.username) {
        res.redirect('/v1/request/key');
        return;
    }
});

app.listen(7800, () => Logger.info('Authentication service listen on port 7800'));
