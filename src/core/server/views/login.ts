import * as alt from 'alt-server';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig } from 'axios';
import { decryptData, encryptData, getPublicKey, sha256Random } from '../utility/encryption';
import Logger from '../utility/tlrp-logger';

dotenv.config();

const azureURL = process.env.ENDPOINT ? process.env.ENDPOINT : `http://mg-community.ddns.net:7800`;
const azureRedirect = encodeURI(`${azureURL}/api/request/key`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${azureRedirect}&prompt=none&response_type=code&scope=identify`;

alt.onClient('discord:Begin', handlePlayerConnect);
alt.onClient('discord:FinishAuth', handleFinishAuth);

async function handlePlayerConnect(player: alt.Player): Promise<void> {
    if (!player || !player.valid) return;
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    player.discordToken = sha256Random(uniquePlayerData);
    const encryptionFormatObject = { player_identifier: player.discordToken };
    const public_key = getPublicKey();
    const encryptedData = await encryptData(JSON.stringify(encryptionFormatObject));
    const senderFormat = { public_key, data: encryptedData };
    const encryptedDataJSON = JSON.stringify(senderFormat);
    alt.emit('Discord:Opened', player);
    alt.emitClient(player, 'Discord:Open', `${url}&state=${encryptedDataJSON}`);
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
    const public_key = getPublicKey();
    const azureURL = getAzureURL();
    const options: AxiosRequestConfig = {
        method: 'POST',
        url: `${azureURL}/api/post/discord`,
        headers: { 'Content-Type': 'application/json' },
        data: { data: { player_identifier, public_key } }
    };
    const result = await axios.request(options).catch((err) => {
        alt.emitClient(player, 'Discord:Fail', 'Could not communicate with Authorization service.');
        return null;
    });
    if (!result) return;
    const data = await decryptData(JSON.stringify(result.data)).catch((err) => {
        alt.emitClient(player, 'Discord:Fail', 'Could not decrypt data from Authorization service.');
        return null;
    });
    if (!data) return;
    alt.emitClient(player, 'Discord:Close');
    alt.emit('Discord:Login', player, JSON.parse(data));
}
