import * as alt from 'alt-server';
import Logger from '../utility/tlrp-logger';
import { getAzureURL } from '../views/login';
import dotenv from 'dotenv';
import express from 'express';
import { LoginManager } from '../systems/login';
import axios from 'axios';

dotenv.config();
const app = express();

app.get('/v1/request/key', async (req, res) => {
    const token = req.query.code;
    const userToken = req.query.state;
    let request;
    if (!token || !userToken) return;
    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env.DISCORD_BOT_CLIENT);
    authParams.append(`client_secret`, process.env.DISCORD_BOT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `http://${getAzureURL()}/v1/request/key`);
    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) return;
    const discordData = { ...request.data };
    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${discordData.token_type} ${discordData.access_token}` }
    });
    if (!request.data || !request.data.id || !request.data.username) return;
    const player = [...alt.Player.all].find((player) => player.discordToken === userToken);
    if (!player || !player.valid) return;
    await LoginManager.tryDiscordQuickToken(player, discordData);
});

app.listen(7800, () => Logger.log('auth service listen on port 7800'));
