import * as alt from 'alt-server';
import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { DiscordUser } from './interfaces/discord-user';
import Logger from './utility/Logger';

dotenv.config();

const authenticated = {};

const htmlPath = path.join(alt.getResourcePath(alt.resourceName), 'server/html');
const cssPath = path.join(alt.getResourcePath(alt.resourceName), 'server/html/css');
const jsPath = path.join(alt.getResourcePath(alt.resourceName), 'server/html/js');
const imgPath = path.join(alt.getResourcePath(alt.resourceName), 'server/html/img');
const app = express();
const port = 7800;

app.use(cors());
app.get('/authenticate', handleAuthentication);
app.use('/js', express.static(jsPath));
app.use('/css', express.static(cssPath));
app.use('/img', express.static(imgPath));

async function handleAuthentication(req: any, res: any): Promise<void> {
    const token: any = req.query.code;
    const userToken: any = req.query.state;
    const html = fs.readFileSync(path.join(htmlPath, '/index.html'));
    let request;
    if (!token || !userToken) {
        res.json({ html: html.toString(), data: { success: false, info: 'Sie haben kein Token bekommen' } });
        return;
    }

    const isLocal = req.connection.localAddress === req.connection.remoteAddress;
    const url = isLocal ? 'http://127.0.0.1:7800' : process.env['ENDPOINT'];
    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env['DISCORD_BOT_ID']);
    authParams.append(`client_secret`, process.env['DISCORD_BOT_SECRET']);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `${url}/authenticate`);

    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) {
        res.json({ html: html.toString(), data: { success: false, info: 'Sie haben keinen gültigen Token' } });
        return;
    }

    const discordData = { ...request.data };

    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${discordData.token_type} ${discordData.access_token}` }
    });

    if (!request.data || !request.data.id || !request.data.username) {
        res.json({ html: html.toString(), data: { success: false, info: 'Ihr Discordkonto wurde nicht gefunden' } });
        return;
    }

    const player = [...alt.Player.all].find((x) => x.discordToken === userToken);
    if (!player || !player.valid) {
        res.json({ html: html.toString(), data: { success: false, info: 'Sie sind nicht auf dem Spieleserver' } });
        return;
    }

    authenticated[userToken] = request.data;
    res.json({ html: html.toString(), data: { success: true, info: 'Sie können den Browser nun schließen und zurück ins Spiel' } });
}

export function getDiscordUser(userToken: string): DiscordUser {
    if (!authenticated[userToken]) return null;
    return authenticated[userToken] as DiscordUser;
}

app.listen(port, () => Logger.info('Discord Authentication started'));
