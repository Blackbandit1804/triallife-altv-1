import * as alt from 'alt-server';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig } from 'axios';
import { decryptData, encryptData, getPublicKey, sha256Random } from '../utility/encryption';

dotenv.config();

const azureURL = process.env.ENDPOINT ? process.env.ENDPOINT : `http://mg-community.ddns.net:7800`;
const azureRedirect = encodeURI(`${azureURL}/v1/request/key`);
const url = `discord.com/api/oauth2/authorize?client_id=660200376523292725&redirect_uri=${azureRedirect}&promp=none&response_type=code&scope=identify`;

alt.onClient('discord:Begin', handlePlayerConnect);
alt.onClient('discord:FinishAuth', handleFinishAuth);

async function handlePlayerConnect(player) {
    if (!player || !player.valid) {
        return;
    }

    // Used to identify the player when the information is sent back.
    const uniquePlayerData = JSON.stringify(player.ip + player.hwidHash + player.hwidExHash);
    player.discordToken = sha256Random(uniquePlayerData);

    // Used as the main data format for talking to the Azure Web App.
    const encryptionFormatObject = {
        player_identifier: player.discordToken
    };

    // Setup Parseable Format for Azure
    const public_key = await getPublicKey();
    const encryptedData = await encryptData(JSON.stringify(encryptionFormatObject));
    const senderFormat = {
        public_key,
        data: encryptedData
    };

    const encryptedDataJSON = JSON.stringify(senderFormat);
    const discordOAuth2URL = getDiscordOAuth2URL();

    alt.emit(`Discord:Opened`, player);
    alt.emitClient(player, 'Discord:Open', `${discordOAuth2URL}&state=${encryptedDataJSON}`);
}

/**
 * Returns the Azure Public Key from the Azure Web App.
 * @export
 * @return {string}
 */
export async function fetchAzureKey() {
    let azurePubKey;

    const result = await axios.get(`${azureURL}/v1/get/key`).catch(() => {
        return null;
    });

    if (!result || !result.data || !result.data.status) {
        return await fetchAzureKey();
    }

    azurePubKey = result.data.key;
    return azurePubKey;
}

/**
 * Gets the Discord oAuth2 URL.
 * @export
 * @return {string}
 */
export function getDiscordOAuth2URL() {
    return url;
}

export function getAzureURL() {
    return azureURL;
}

async function handleFinishAuth(player) {
    const player_identifier = player.discordToken;
    if (!player_identifier) {
        return;
    }

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
        alt.emitClient(player, 'Discord:Fail', 'Could not communicate with Authorization service.');
        return null;
    });

    if (!result) {
        return;
    }

    const data = await decryptData(JSON.stringify(result.data)).catch((err) => {
        alt.emitClient(player, 'Discord:Fail', 'Could not decrypt data from Authorization service.');
        return null;
    });

    if (!data) {
        return;
    }

    alt.emitClient(player, `Discord:Close`);
    alt.emit('Discord:Login', player, JSON.parse(data));
}
