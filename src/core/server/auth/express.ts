import * as alt from 'alt-server';
import Logger from '../utility/Logger';
import { DiscordUser } from '../interfaces/discord-user';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import axios from 'axios';

dotenv.config();

const authenticated = {};

const htmlPath = path.join(alt.getResourcePath(alt.resourceName), 'server/auth/html');
const cssPath = path.join(alt.getResourcePath(alt.resourceName), 'server/auth/html/css');
const jsPaths = path.join(alt.getResourcePath(alt.resourceName), 'server/auth/html/js');
const imgPaths = path.join(alt.getResourcePath(alt.resourceName), 'server/auth/html/img');
const app = express();
const port = 7800;

app.use(cors());
app.get('/authenticate', authenticate);
app.use('/js', express.static(jsPaths));
app.use('/css', express.static(cssPath));
app.use('/img', express.static(imgPaths));

async function authenticate(req, res) {
    const token = req.query.code;
    const userToken = req.query.state;
    let request;

    if (!token || !userToken) {
        req.params.success = false;
        req.params.info = 'Sie haben kein Token erhalten';
        return;
    }

    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env.DISCORD_BOT_ID);
    authParams.append(`client_secret`, process.env.DISCORD_BOT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `${process.env.ENDPOINT}/authenticate`);

    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) {
        req.params.success = false;
        req.params.info = 'Sie haben einen falschen Token benutzt';
        return;
    }

    const discordData = { ...request.data };

    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${discordData.token_type} ${discordData.access_token}` }
    });

    if (!request.data || !request.data.id || !request.data.username) {
        req.params.success = false;
        req.params.info = 'Sie sind nicht auf unserem Discord Server';
        return;
    }

    authenticated[userToken] = request.data;

    req.params.success = true;
    req.params.info = 'Sie können das Fenster nun schließen und ins Spiel zurück kehren.';
}

export async function getDiscordUser(userToken: string): Promise<DiscordUser> {
    if (!authenticated[userToken]) return null;
    return authenticated[userToken] as DiscordUser;
}

app.listen(port, () => Logger.info('Discord Authentication started'));
