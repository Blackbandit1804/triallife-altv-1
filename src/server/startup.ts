/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import dotenv from 'dotenv';
import { encryptData, getPublicKey, sha256Random } from './utility/encryption';
import { getDiscordOAuth2URL } from './auth/getRequest';
import './systems/authServer';
import { Database, onReady } from 'simplymongo';
import { Collections } from './utility/enums';

dotenv.config();
const collections = [Collections.Accounts, Collections.Characters, Collections.Options, Collections.Interiors];

let db = new Database(process.env.MONGO_URL, 'altv', collections);

onReady(() => {
    import('./systems/options').then((res) => res.default());
    import('./systems/discord').then((res) => res.default());
});

alt.on('playerConnect', handlePlayerConnect);

async function handlePlayerConnect(player: alt.Player): Promise<void> {
    if (!player || !player.valid) return;
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    player.discordToken = sha256Random(uniquePlayerData);
    const encryptionFormatObject = { token: player.discordToken };
    const public_key = await getPublicKey();
    const data = await encryptData(JSON.stringify(encryptionFormatObject));
    const senderFormat = { public_key, data };
    const encryptedDataJSON = JSON.stringify(senderFormat);
    const discordOAuth2URL = getDiscordOAuth2URL();
    alt.emit(`Discord:Opened`, player);
    alt.emitClient(player, 'Discord:Open', `${discordOAuth2URL}&state=${encryptedDataJSON}`);
}
