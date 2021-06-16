import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { DefaultConfig } from '../configs/settings';
import { playerFuncs } from '../extensions/player';

let mainChannel: alt.VoiceChannel;

if (DefaultConfig.VOICE_ON) {
    alt.on('playerDisconnect', handleDisconnect);
    alt.on(SystemEvent.VOICE_ADD, addToGlobalVoice);

    mainChannel = new alt.VoiceChannel(true, 25);
}

/**
 * If global voice is it will remove a player from the ranged voice chat.
 * @param {alt.Player} player
 * @return {*}
 */
function handleDisconnect(player: alt.Player) {
    if (!DefaultConfig.VOICE_ON || !player || !player.valid) {
        return;
    }

    try {
        mainChannel.removePlayer(player);
    } catch (err) {
        alt.log(`[3L:RP] Could not remove null player from voice. Likely due to reconnect.`);
    }
}

/**
 * Adds a player to the range based voice chat.
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function addToGlobalVoice(player: alt.Player) {
    if (mainChannel.isPlayerInChannel(player)) {
        return;
    }

    playerFuncs.emit.message(player, `[3L:RP] You have joined the global voice server.`);
    player.emit(SystemEvent.VOICE_JOINED);
    mainChannel.addPlayer(player);
}
