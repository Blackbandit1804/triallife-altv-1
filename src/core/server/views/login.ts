import * as alt from 'alt-server';
import dotenv from 'dotenv';
import { getDiscordUser } from '../auth/express';
import { sha256Random } from '../utility/usefull';

dotenv.config();

alt.onClient('discord:Begin', handlePlayerConnect);
alt.onClient('discord:FinishAuth', handleFinishAuth);
const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_BOT_ID}&redirect_uri=${process.env.ENDPOINT}&prompt=none&response_type=code&scope=identify`;

async function handlePlayerConnect(player) {
    if (!player || !player.valid) return;
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    const playerToken = sha256Random(uniquePlayerData);
    player.discordToken = playerToken;
    alt.emit(`Discord:Opened`, player);
    alt.emitClient(player, 'Discord:Open', `${url}&state=${playerToken}`);
}

async function handleFinishAuth(player) {
    const player_identifier = player.discordToken;
    if (!player_identifier) return;
    const data = await getDiscordUser(player_identifier);
    if (!data) return;
    alt.emitClient(player, `Discord:Close`);
    alt.emit('Discord:Login', player, data);
}
