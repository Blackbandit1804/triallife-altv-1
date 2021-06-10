/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/utility/enums';
import { DEFAULT_CONFIG } from '../tlrp/config';
import { playerFuncs } from '../extensions/player';

let mainChannel: alt.VoiceChannel;

if (DEFAULT_CONFIG.VOICE_ON) {
    alt.on('playerDisconnect', handleDisconnect);
    alt.on(SYSTEM_EVENTS.VOICE_ADD, addToGlobalVoice);
    mainChannel = new alt.VoiceChannel(true, 25);
}

function handleDisconnect(player: alt.Player) {
    if (!DEFAULT_CONFIG.VOICE_ON || !player || !player.valid) return;
    try {
        mainChannel.removePlayer(player);
    } catch (err) {
        alt.log(`[3L:RP] Could not remove null player from voice. Likely due to reconnect.`);
    }
}

export function addToGlobalVoice(player: alt.Player) {
    if (mainChannel.isPlayerInChannel(player)) return;
    alt.emitClient(player, SYSTEM_EVENTS.VOICE_JOINED);
    mainChannel.addPlayer(player);
}
