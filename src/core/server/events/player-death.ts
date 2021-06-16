import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/player';

alt.on('playerDeath', handleDeath);

function handleDeath(player: alt.Player, killer: alt.Player, weaponHash: any): void {
    if (!player || !player.valid) return;
    playerFuncs.set.unconscious(player, killer, weaponHash);
}
