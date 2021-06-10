/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import sjcl from 'sjcl';
import ecc from 'elliptic';
import { fetchAzureKey } from '../auth/getRequest';

const elliptic = new ecc.ec('curve25519');

let privateKey;
let publicKey;
let azurePubKey;
let secretKey;

export function sha256(data): string {
    const hashBits = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBits);
}

export function sha256Random(data): string {
    return sha256(`${data} + ${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`);
}

export async function getPublicKey(): Promise<string> {
    if (!privateKey) privateKey = elliptic.genKeyPair().getPrivate().toString(16);
    if (!publicKey) publicKey = elliptic.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex', true);
    if (!azurePubKey) azurePubKey = await fetchAzureKey();
    if (!secretKey) secretKey = await getSharedSecret();
    return publicKey;
}

export function getPrivateKey(): string {
    if (!privateKey) privateKey = elliptic.genKeyPair().getPrivate().toString(16);
    return privateKey;
}

export async function encryptData(jsonData): Promise<string> {
    const sharedSecret = await getSharedSecret();
    try {
        const partialEncryption = sjcl.encrypt(sharedSecret, jsonData, { mode: 'gcm' });
        const safeEncryption = partialEncryption.replace(/\+/g, '_'); // Discord oAuth2 does something funky to `+` signs.
        return safeEncryption;
    } catch (err) {
        return null;
    }
}

export async function decryptData(jsonData): Promise<string> {
    const sharedSecret = await getSharedSecret();
    try {
        const cleanedEncryption = jsonData.replace(/\_/g, '+'); // Discord oAuth2 does something funky to `+` signs.
        return sjcl.decrypt(sharedSecret, cleanedEncryption, { mode: 'gcm' });
    } catch (err) {
        return null;
    }
}

export async function getSharedSecret(): Promise<string> {
    try {
        const ecPrivateKey = elliptic.keyFromPrivate(getPrivateKey(), 'hex');
        const ecPublicKey = elliptic.keyFromPublic(azurePubKey, 'hex');
        const sharedKey = ecPrivateKey.derive(ecPublicKey.getPublic()).toString(16);
        return sharedKey;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getAzureKey(): Promise<string> {
    if (!azurePubKey) azurePubKey = await fetchAzureKey();
    return azurePubKey;
}

export function getUniquePlayerHash(player: alt.Player, discord: string): string {
    return sha256(sha256(`${player.hwidHash}${player.hwidExHash}${player.ip}${discord}${player.socialID}`));
}
