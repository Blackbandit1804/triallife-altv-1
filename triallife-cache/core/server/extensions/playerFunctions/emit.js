import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../../shared/utility/enums';
import utility from './utility';
function animation(player, dictionary, name, flags, duration = -1) {
    if (player.data.isUnconscious) {
        alt.logWarning(`[3L:RP] Cannot play ${dictionary}@${name} while player is unconscious.`);
        return;
    }
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ANIMATION, dictionary, name, flags, duration);
}
function audioStream(stream) {
    alt.emitClient(null, SYSTEM_EVENTS.PLAYER_EMIT_AUDIO_STREAM, stream);
}
function meta(player, key, value) {
    alt.nextTick(() => alt.emitClient(player, SYSTEM_EVENTS.META_SET, key, value));
}
function notification(player, message) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, message);
}
function particle(player, particle, emitToNearbyPlayers = false) {
    if (!emitToNearbyPlayers) {
        alt.emitClient(player, SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, particle);
        return;
    }
    const nearbyPlayers = utility.getClosestPlayers(player, 10);
    for (let i = 0; i < nearbyPlayers.length; i++) {
        const target = nearbyPlayers[i];
        alt.emitClient(target, SYSTEM_EVENTS.PLAY_PARTICLE_EFFECT, particle);
    }
}
function createProgressBar(player, progressbar) {
    alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_CREATE, progressbar);
}
function removeProgressBar(player, uid) {
    alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_REMOVE, uid);
}
function sound2D(player, audioName, volume = 0.35) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, audioName, volume);
}
function sound3D(player, audioName, target) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, target, audioName);
}
function soundFrontend(player, audioName, ref) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_FRONTEND_SOUND, audioName, ref);
}
function taskTimeline(player, tasks) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, tasks);
}
export default {
    animation,
    audioStream,
    createProgressBar,
    meta,
    notification,
    particle,
    removeProgressBar,
    sound2D,
    sound3D,
    soundFrontend,
    taskTimeline
};
