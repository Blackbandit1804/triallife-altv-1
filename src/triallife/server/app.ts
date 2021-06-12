import * as alt from 'alt-server';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { OptionsController } from './system/options';
import { DefaultConfig } from './configs/settings';

const htmlPath = path.join(alt.getResourcePath(alt.resourceName), 'server/html');
const cssPath = path.join(alt.getResourcePath(alt.resourceName), 'server/html/css');
const jsPaths = path.join(alt.getResourcePath(alt.resourceName), 'server/html/js');
const app = express();

app.use(cors());
app.get('/auth/redirect', handleMainRedirect);
app.use('/js', express.static(jsPaths));
app.use('/css', express.static(cssPath));

async function handleMainRedirect(req, res) {
    const token = req.query.code;
    const userToken = req.query.state;
    let request;
    if (!token || !userToken) {
        res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        return;
    }

    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env['CLIENT_ID']);
    authParams.append(`client_secret`, process.env['CLIENT_SECRET']);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `http://${process.env['REDIRECT_IP']}:7790/authenticate`);

    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!request.data || !request.data.access_token) {
        res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        return;
    }

    const discordData = { ...request.data };
    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${discordData.token_type} ${discordData.access_token}`
        }
    });
    if (!request.data || !request.data.id || !request.data.username) {
        res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        return;
    }
    const player = [...alt.Player.all].find((player) => player.discordToken === userToken);
    if (!player || !player.valid) {
        res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        return;
    }

    if (DefaultConfig.WHITELIST) {
        const isAuthorized = OptionsController.isWhitelisted(request.data.id);
        if (!isAuthorized) {
            res.sendFile(path.join(htmlPath, '/whitelist.html'), (err) => {});
            return;
        }
    }

    alt.emitClient(player, 'discord:AuthExit');
    alt.emit('discord:AuthDone', player, request.data);
    res.sendFile(path.join(htmlPath, '/done.html'), (err) => {});
}

app.listen(7800);
