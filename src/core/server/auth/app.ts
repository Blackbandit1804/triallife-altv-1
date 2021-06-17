import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Logger from '../utility/tlrp-logger';
import * as routes from './routes';

dotenv.config();
const app = express();
const port = 7800;

app.use(cors());
app.use('/api', routes);
app.listen(port, () => Logger.info(`tlrp auth service listen on port ${port}`));

/*async (req, res) => {
    const token = req.query.code;
    const crypted = req.query.state;
    let request;
    if (!token || !crypted) return;
    const decrypted = await decryptData(crypted);
    const data = JSON.parse(decrypted);
    const authParams = new URLSearchParams();
    authParams.append(`client_id`, process.env.CLIENT_ID);
    authParams.append(`client_secret`, process.env.CLIENT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `${process.env.ENDPOINT}/authenticate`);
    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    if (!request.data || !request.data.access_token) return;
    const discordData = { ...request.data };
    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `${discordData.token_type} ${discordData.access_token}` }
    });
    if (!request.data || !request.data.id || !request.data.username) return;
    const player = [...alt.Player.all].find((player) => player.discordToken === data.player_identifier);
    if (!player || !player.valid) return;
    LoginManager.tryDiscordQuickToken(player, request.data.id.toString());
});

app.get('/v1/get/key', async (req, res) => res.send(JSON.stringify({ status: true, key: getPublicKey() })));*/
