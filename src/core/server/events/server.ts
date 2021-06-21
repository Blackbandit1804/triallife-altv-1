import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/player';

alt.on('Discord:Opened', async (player: alt.Player): Promise<void> => {
    alt.setTimeout(() => {
        if (!player || !player.valid) return;
        alt.log(`(${player.id}) ${player.name} has connected to the server.`);
        playerFuncs.set.firstConnect(player);
    }, 0);
});

alt.on('playerDeath', (player: alt.Player, killer: alt.Player, weaponHash: any) => {
    if (!player || !player.valid) return;
    playerFuncs.set.unconsciouse(player, killer, weaponHash);
});
