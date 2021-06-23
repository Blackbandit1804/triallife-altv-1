import * as alt from 'alt-server';
import sjcl from 'sjcl';
import ecc from 'elliptic';
import * as TlrpMath from '../utility/math';

const elliptic = new ecc.ec('curve25519');

export function getUniquePlayerHash(player: alt.Player, discord: string): string {
    return sha256(sha256(`${player.hwidHash}${player.hwidExHash}${player.ip}${discord}${player.socialID}`));
}

export function sha256(data: string): string {
    const hashBits = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBits);
}

export function sha256Random(data: string): string {
    const randomValue = TlrpMath.random(0, Number.MAX_SAFE_INTEGER);
    return sha256(`${data} + ${randomValue}`);
}

export function stripCategory(value: string): number {
    return parseInt(value.replace(/.*-/gm, ''));
}
