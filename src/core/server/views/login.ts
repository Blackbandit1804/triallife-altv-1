import * as alt from 'alt-server';
import dotenv from 'dotenv';
import { getDiscordUserByToken } from '../express';
import { sha256Random } from '../utility/encryption';

dotenv.config();

const azureURL = process.env.ENDPOINT ? process.env.ENDPOINT : `http://mg-community.ddns.net:7800`;
const azureRedirect = encodeURI(`${azureURL}/api/request/key`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${azureRedirect}&prompt=none&response_type=code&scope=identify`;

alt.onClient('discord:Begin', handlePlayerConnect);
alt.onClient('discord:FinishAuth', handleFinishAuth);

async function handlePlayerConnect(player: alt.Player): Promise<void> {
    if (!player || !player.valid) return;
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    const playerToken = sha256Random(uniquePlayerData);
    player.discordToken = playerToken;
    alt.emit('Discord:Opened', player);
    alt.emitClient(player, 'Discord:Open', `${url}&state=${playerToken}`);
}

async function handleFinishAuth(player: alt.Player): Promise<void> {
    const player_identifier = player.discordToken;
    if (!player_identifier) return;
    alt.emitClient(player, 'Discord:Close');
    alt.emit('Discord:Login', player, JSON.parse(getDiscordUserByToken(player_identifier)));
}
