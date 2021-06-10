/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { distance } from '../../shared/utility/vector';

export function getClosestPlayer(player: alt.Player): alt.Player {
    const players = [...alt.Player.all];
    let targetPlayer = players[0] !== player ? players[0] : players[1];
    let dist = distance(player.pos, targetPlayer.pos);
    for (let i = 0; i < players.length; i++) {
        const newDistance = distance(player.pos, players[i].pos);
        if (!players[i] || !players[i].data) continue;
        if (players[i] === player) continue;
        if (dist > newDistance) continue;
        dist = newDistance;
        targetPlayer = players[i];
    }
    return targetPlayer;
}
