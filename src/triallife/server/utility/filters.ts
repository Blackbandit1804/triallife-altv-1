import * as alt from 'alt-server';
import { Permissions } from '../../shared/enums/permission';
import { distance } from '../../shared/utility/vector';
import { TlrpFunctions, WASM } from './wasmLoader';

const wasm = WASM.getFunctions<TlrpFunctions>('tlrp');

export function getPlayersByPermissionLevel(permissionLevels: Array<Permissions>): Array<alt.Player> {
    const validPlayers = [...alt.Player.all].filter(
        (p) => p && p.data && p.accountData && permissionLevels.includes(p.accountData.permissionLevel)
    );
    return validPlayers;
}

export function getPlayersByGridSpace(player: alt.Player, maxDistance: number): Array<alt.Player> {
    const currentPlayers = [...alt.Player.all];
    return currentPlayers.filter(
        (p) => p && p.valid && p.data && player.gridSpace === p.gridSpace && distance(player.pos, p.pos) < maxDistance
    );
}

export function getClosestPlayer(player: alt.Player): alt.Player {
    const players = [...alt.Player.all];
    let targetPlayer = players[0] !== player ? players[0] : players[1];
    let dist = distance(player.pos, targetPlayer.pos);
    for (let i = 0; i < players.length; i++) {
        const newDistance = distance(player.pos, players[i].pos);
        if (!players[i] || !players[i].data) continue;
        if (players[i] === player) continue;
        if (players[i].gridSpace !== player.gridSpace) continue;
        if (wasm.TlrpMath.isGreater(dist, newDistance)) continue;
        dist = newDistance;
        targetPlayer = players[i];
    }

    return targetPlayer;
}
