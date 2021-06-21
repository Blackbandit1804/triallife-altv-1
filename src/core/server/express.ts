import * as alt from 'alt-server';
import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { DiscordUser } from './interfaces/discord-user';
import Logger from './utility/Logger';

dotenv.config();

const authenticated = {};

const htmlPath = path.join(alt.getResourcePath(alt.resourceName), '/server/html');
const cssPath = path.join(alt.getResourcePath(alt.resourceName), '/server/html/css');
const jsPath = path.join(alt.getResourcePath(alt.resourceName), '/server/html/js');
const app = express();
const port = 7800;

app.use(cors());
app.get('/authenticate', handleAuthentication);
app.use('/js', express.static(jsPath));
app.use('/css', express.static(cssPath));

async function handleAuthentication(req: any, res: any): Promise<void> {
    const token: string = req.query.code;
    const userToken: string = req.query.state;
    let request;

    if (!token || !userToken) {
        res.sendFile(path.join(htmlPath, '/index.html'), (err) => {});
        return;
    }

    const authParams: URLSearchParams = new URLSearchParams();
    authParams.append(`client_id`, process.env.DISCORD_BOT_ID);
    authParams.append(`client_secret`, process.env.DISCORD_BOT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `${process.env.ENDPOINT}/authenticate`);

    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) {
        res.sendFile(path.join(htmlPath, '/index.html'), (err) => {});
        return;
    }

    const discordData = { ...request.data };

    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${discordData.token_type} ${discordData.access_token}` }
    });

    if (!request.data || !request.data.id || !request.data.username) {
        res.sendFile(path.join(htmlPath, '/index.html'), (err) => {});
        return;
    }

    const player = [...alt.Player.all].find((x) => x.discordToken === userToken);
    if (!player || !player.valid) {
        res.sendFile(path.join(htmlPath, '/index.html'), (err) => {});
        return;
    }

    authenticated[userToken] = request.data;
    res.sendFile(path.join(htmlPath, '/index.html'), (err) => {});
}

export function getDiscordUser(userToken: string): DiscordUser {
    if (!authenticated[userToken]) return null;
    return authenticated[userToken] as DiscordUser;
}

app.listen(port, () => Logger.info('Discord Authentication started'));
