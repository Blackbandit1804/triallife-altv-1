/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { decryptData, getPublicKey } from '../utility/encryption';
import { getAzureURL } from '../auth/getRequest';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig } from 'axios';

dotenv.config();

alt.onClient('discord:Auth', discordAuth);

async function discordAuth(player) {
    const token = player.discordToken;
    if (!token) return;
    const public_key = await getPublicKey();
    const azureURL = await getAzureURL();
    const options = {
        method: 'POST',
        url: `${azureURL}/v1/post/discord`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            data: {
                token,
                public_key
            }
        }
    } as AxiosRequestConfig;
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
    alt.emitClient(player, `Discord:Close`);
    alt.emit('Discord:Login', player, JSON.parse(data));
}
