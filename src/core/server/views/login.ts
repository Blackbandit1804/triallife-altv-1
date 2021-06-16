import * as alt from 'alt-server';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig } from 'axios';
import { decryptData, encryptData, getPublicKey, sha256Random } from '../utility/encryption';

dotenv.config();

const azureURL = process.env.ENDPOINT;
const azureRedirect = encodeURI(`${azureURL}/v1/request/key`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_BOT_CLIENT}&redirect_uri=${azureRedirect}&prompt=none&response_type=code&scope=identify`;

alt.onClient('discord:Begin', handlePlayerConnect);
alt.onClient('discord:FinishAuth', handleFinishAuth);

async function handlePlayerConnect(player: alt.Player): Promise<void> {
    if (!player || !player.valid) return;
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    player.discordToken = sha256Random(uniquePlayerData);
    const encryptionFormatObject = { player_identifier: player.discordToken };
    const public_key = await getPublicKey();
    const encryptedData = await encryptData(JSON.stringify(encryptionFormatObject));
    const senderFormat = { public_key, data: encryptedData };
    const encryptedDataJSON = JSON.stringify(senderFormat);
    const discordOAuth2URL = getDiscordOAuth2URL();
    alt.emit(`Discord:Opened`, player);
    player.emit('Discord:Open', `${discordOAuth2URL}&state=${encryptedDataJSON}`);
}

export async function fetchAzureKey(): Promise<string> {
    let azurePubKey;
    const result = await axios.get(`${azureURL}/v1/get/key`).catch(() => null);
    if (!result || !result.data || !result.data.status) return await fetchAzureKey();
    azurePubKey = result.data.key;
    return azurePubKey;
}

export function getDiscordOAuth2URL(): string {
    return url;
}

export function getAzureURL(): string {
    return azureURL;
}

async function handleFinishAuth(player: alt.Player): Promise<void> {
    const player_identifier = player.discordToken;
    if (!player_identifier) return;
    const public_key = await getPublicKey();
    const azureURL = await getAzureURL();
    const options: AxiosRequestConfig = {
        method: 'POST',
        url: `${azureURL}/v1/post/discord`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            data: {
                player_identifier,
                public_key
            }
        }
    };
    const result = await axios.request(options).catch((err) => {
        player.emit('Discord:Fail', 'Could not communicate with Authorization service.');
        return null;
    });
    if (!result) return;
    const data = await decryptData(JSON.stringify(result.data)).catch((err) => {
        player.emit('Discord:Fail', 'Could not decrypt data from Authorization service.');
        return null;
    });
    if (!data) return;
    player.emit('Discord:Close');
    alt.emit('Discord:Login', player, JSON.parse(data));
}
