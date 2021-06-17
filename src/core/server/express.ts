import * as alt from 'alt-server';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import Logger from './utility/tlrp-logger';
import { DiscordUser } from './interface/discord-user';

const dcData = {};
const app = express();
app.use(cors());

app.get('/api/request/key', async (req, res) => {
    const token = req.query.code;
    const userToken = req.query.state;
    let request;
    if (!token || !userToken) return;
    const player = [...alt.Player.all].find((player) => player.discordToken === userToken);
    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env.CLIENT_ID);
    authParams.append(`client_secret`, process.env.CLIENT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `${process.env.ENDPOINT}/api/request/key`);
    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) return;
    const discordData = { ...request.data };
    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${discordData.token_type} ${discordData.access_token}` }
    });
    if (!request.data || !request.data.id || !request.data.username) return;
    dcData[userToken] = JSON.stringify(request.data);
});

app.get('/api/get/key', async (req, res) => res.send({ status: true, key: '7ab7ab93f799702223b12852b377887215fce530a7cf4a6e7c857958377f2f15' }));

export function getDiscordUserByToken(token: string): string {
    if (!dcData[token]) return null;
    return dcData[token];
}

app.listen(7800, () => Logger.info(`starting discord authentication service on port 7800`));
