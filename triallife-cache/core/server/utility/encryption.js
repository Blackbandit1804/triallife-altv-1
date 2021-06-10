import { TLRP } from './tlrpLoader';
import sjcl from 'sjcl';
import ecc from 'elliptic';
import { fetchAzureKey } from '../auth/getRequests';
const elliptic = new ecc.ec('curve25519');
let tlrp = TLRP.getFunctions('tlrp');
let privateKey;
let publicKey;
let azurePubKey;
let secretKey;
export function sha256(data) {
    const hashBits = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBits);
}
export function sha256Random(data) {
    if (!tlrp)
        tlrp = TLRP.getFunctions('tlrp');
    const randomValue = tlrp.Math.random(0, Number.MAX_SAFE_INTEGER);
    return sha256(`${data} + ${randomValue}`);
}
export async function getPublicKey() {
    if (!privateKey)
        privateKey = elliptic.genKeyPair().getPrivate().toString(16);
    if (!publicKey)
        publicKey = elliptic.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex', true);
    if (!azurePubKey)
        azurePubKey = await fetchAzureKey();
    if (!secretKey)
        secretKey = await getSharedSecret();
    return publicKey;
}
export function getPrivateKey() {
    if (!privateKey)
        privateKey = elliptic.genKeyPair().getPrivate().toString(16);
    return privateKey;
}
export async function encryptData(jsonData) {
    const sharedSecret = await getSharedSecret();
    try {
        const partialEncryption = sjcl.encrypt(sharedSecret, jsonData, { mode: 'gcm' });
        const safeEncryption = partialEncryption.replace(/\+/g, '_');
        return safeEncryption;
    }
    catch (err) {
        return null;
    }
}
export async function getSharedSecret() {
    try {
        const ecPrivateKey = elliptic.keyFromPrivate(getPrivateKey(), 'hex');
        const ecPublicKey = elliptic.keyFromPublic(azurePubKey, 'hex');
        const sharedKey = ecPrivateKey.derive(ecPublicKey.getPublic()).toString(16);
        return sharedKey;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
export async function getAzureKey() {
    if (!azurePubKey)
        azurePubKey = await fetchAzureKey();
    return azurePubKey;
}
