import * as alt from 'alt-server';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';
import { TlrpEvent } from '../utility/enums';

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

alt.on('playerDamage', (player: alt.Player, attacker: alt.Entity, damage: number, weaponHash: any) => {
    if (!player || !player.valid) return;
    if (player.data.isUnconsciouse) {
        player.health = 199;
        return;
    }
    playerFuncs.save.addHealth(player, -damage, false);
});

alt.onClient('SaltyChat:SetRange', (player: alt.Player, range: number) => playerFuncs.emit.meta(player, 'voice', range));
