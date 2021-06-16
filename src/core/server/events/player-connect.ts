import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/player';
import { default as logger, default as Logger } from '../utility/tlrp-logger';
import './player-death';

alt.on('Discord:Opened', handlePlayerConnect);

function handlePlayerConnect(player: alt.Player): void {
    if (!player || !player.valid) return;
    logger.log(`(${player.id}) ${player.name} has connected to the server.`);
    playerFuncs.set.firstConnect(player);
}
