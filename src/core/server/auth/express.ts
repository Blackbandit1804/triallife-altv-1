import * as alt from 'alt-server';
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import Logger from '../utility/Logger';
import { ViewEvent } from '../../shared/utility/enums';
import { DiscordUser } from '../interfaces/discord-user';

dotenv.config();
const authenticated = {};
const app = express();
const port = 7800;

app.get('/authenticate', async (req, res) => {
    const token = req.query.code;
    const userToken = req.query.state;
    let request;
    if (!token || !userToken) return;
    const player = [...alt.Player.all].find((player) => player.discordToken === userToken);
    if (!player || !player.valid) return;

    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env.DISCORD_BOT_ID);
    authParams.append(`client_secret`, process.env.DISCORD_BOT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `${process.env.ENDPOINT}/authenticate`);

    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) {
        alt.emitClient(player, ViewEvent.Discord_Fail, 'Sie haben keinen gültigen Token übergeben');
        return;
    }
    const discordData = { ...request.data };
    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${discordData.token_type} ${discordData.access_token}` }
    });
    if (!request.data || !request.data.id || !request.data.username) {
        alt.emitClient(player, ViewEvent.Discord_Fail, 'Sie sind nicht auf unserem Server oder unserem Discord');
        return;
    }
    authenticated[userToken] = request.data;
});

export async function getDiscordUser(userToken: string): Promise<DiscordUser> {
    if (!authenticated[userToken]) return null;
    return authenticated[userToken] as DiscordUser;
}

app.listen(port, () => Logger.info('Discord Authentication started'));
