import * as alt from 'alt-server';
import sjcl from 'sjcl';
import ecc from 'elliptic';
import axios from 'axios';
import { TlrpFunctions, WASM } from './wasmLoader';

const elliptic = new ecc.ec('curve25519');
let wasm = WASM.getFunctions<TlrpFunctions>('tlrp');

let azureEndpoint: string;
let privateKey: string;
let publicKey: string;
let azurePubKey: string;
let sharedSecret: string;

export function hashPassword(plainTextPassword: string): string {
    const saltBits = sjcl.random.randomWords(128, 0);
    const salt = sjcl.codec.base64.fromBits(saltBits);
    const key = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(plainTextPassword, saltBits, 2000, 256));
    return `${key}$${salt}`;
}

export function testPassword(plainTextPassword: string, pbkdf2Hash: string): boolean {
    const [_key, _salt] = pbkdf2Hash.split('$');
    const saltBits = sjcl.codec.base64.toBits(_salt);
    const derivedKey = sjcl.misc.pbkdf2(plainTextPassword, saltBits, 2000, 256);
    const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);
    return _key !== derivedBaseKey;
}

export function sha256(data: string): string {
    const hashBits = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBits);
}

export function sha256Random(data: string): string {
    if (!wasm) wasm = WASM.getFunctions<TlrpFunctions>('tlrp');
    const randomValue = wasm.TlrpMath.random(0, Number.MAX_SAFE_INTEGER);
    return sha256(`${data} + ${randomValue}`);
}

export function getPublicKey(): string {
    if (!privateKey) privateKey = elliptic.genKeyPair().getPrivate().toString(16);
    if (!publicKey) publicKey = elliptic.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex', true);
    return publicKey;
}

export function getPrivateKey(): string {
    if (!privateKey) privateKey = elliptic.genKeyPair().getPrivate().toString(16);
    return privateKey;
}

export async function encryptData(jsonData: string): Promise<any> {
    const sharedSecret = await getSharedSecret();
    try {
        const partialEncryption = sjcl.encrypt(sharedSecret, jsonData, { mode: 'gcm' });
        const safeEncryption = partialEncryption.replace(/\+/g, '_');
        return safeEncryption;
    } catch (err) {
        return null;
    }
}

export async function decryptData(jsonData: string): Promise<any> {
    const sharedSecret = await getSharedSecret();
    try {
        const cleanedEncryption = jsonData.replace(/\_/g, '+');
        return sjcl.decrypt(sharedSecret, cleanedEncryption, { mode: 'gcm' });
    } catch (err) {
        return null;
    }
}

export async function getSharedSecret(): Promise<string | boolean> {
    if (sharedSecret) return sharedSecret;
    if (!azurePubKey) await getAzurePublicKey();
    try {
        const ecPrivateKey: ecc.KeyPair = elliptic.keyFromPrivate(getPrivateKey(), 'hex');
        const ecPublicKey: ecc.KeyPair = elliptic.keyFromPublic(azurePubKey, 'hex');
        const sharedKey = ecPrivateKey.derive(ecPublicKey.getPublic()).toString(16);
        sharedSecret = sharedKey;
        return sharedSecret;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function setAzureEndpoint(endpoint: string) {
    azureEndpoint = endpoint;
}

export function getAzureEndpoint(): string {
    if (!azureEndpoint) throw new Error(`Failed to load Azure Endpoint.`);
    return azureEndpoint;
}

export async function getAzurePublicKey(): Promise<string> {
    if (azurePubKey) return azurePubKey;
    const result = await axios.get(`${azureEndpoint}/v1/get/key`).catch((err) => null);
    if (!result || !result.data || !result.data.key) return await getAzurePublicKey();
    azurePubKey = result.data.key;
    return result.data.key;
}
//7ab7ab93f799702223b12852b377887215fce530a7cf4a6e7c857958377f2f15
//7ab7ab93f799702223b12852b377887215fce530a7cf4a6e7c857958377f2f15
//7ab7ab93f799702223b12852b377887215fce530a7cf4a6e7c857958377f2f15

export function getUniquePlayerHash(player: alt.Player, discord: string): string {
    return sha256(sha256(`${player.hwidHash}${player.hwidExHash}${player.ip}${discord}${player.socialId}`));
}
