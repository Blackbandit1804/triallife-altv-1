import * as alt from 'alt-server';
import dotenv from 'dotenv';
import { ViewEvent } from '../../shared/utility/enums';
import { getDiscordUser } from '../express';
import { sha256Random } from '../utility/usefull';

dotenv.config();
const ip = encodeURI(`${process.env.ENDPOINT}/authenticate`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_BOT_ID}&redirect_uri=${ip}&prompt=none&response_type=code&scope=identify`;
alt.onClient('discord:Begin', handlePlayerConnect);
alt.onClient('discord:FinishAuth', handleFinishAuth);

async function handlePlayerConnect(player: alt.Player): Promise<void> {
    if (!player || !player.valid) return;
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    const playerToken = sha256Random(uniquePlayerData);
    player.discordToken = playerToken;
    alt.emit(`Discord:Opened`, player);
    alt.emitClient(player, 'Discord:Open', `${url}&state=${playerToken}`);
}

function handleFinishAuth(player: alt.Player): void {
    const player_identifier = player.discordToken;
    if (!player_identifier) {
        alt.emitClient(player, ViewEvent.Discord_Fail, `Ihre Identifizierung ist fehlgeschlagen`);
        return;
    }
    const data = getDiscordUser(player_identifier);
    if (!data) {
        alt.emitClient(player, ViewEvent.Discord_Fail, 'Wir konnten keine Discord Daten finden');
        return;
    }
    alt.emitClient(player, ViewEvent.Discord_Close);
    alt.emit('Discord:Login', player, data);
}
