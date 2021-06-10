/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../../shared/utility/enums';
import { AnimationFlags } from '../../../shared/flags/animation';
import { AudioStream } from '../../../shared/interfaces/audio';
import { Particle } from '../../../shared/interfaces/particle';
import { ProgressBar } from '../../../shared/interfaces/progress-bar';
import { Task, TaskCallback } from '../../../shared/interfaces/task-timeline';
import utility from './utility';

function animation(player: alt.Player, dictionary: string, name: string, flags: AnimationFlags, duration: number = -1): void {
    if (player.data.isUnconscious) {
        alt.logWarning(`[3L:RP] Cannot play ${dictionary}@${name} while player is unconscious.`);
        return;
    }
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_ANIMATION, dictionary, name, flags, duration);
}

function audioStream(stream: AudioStream) {
    alt.emitClient(null, SYSTEM_EVENTS.PLAYER_EMIT_AUDIO_STREAM, stream);
}

function meta(player: alt.Player, key: string, value: any): void {
    alt.nextTick(() => alt.emitClient(player, SYSTEM_EVENTS.META_SET, key, value));
}

function notification(player: alt.Player, message: string): void {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, message);
}

function particle(player: alt.Player, particle: Particle, emitToNearbyPlayers = false): void {
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

function createProgressBar(player: alt.Player, progressbar: ProgressBar) {
    alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_CREATE, progressbar);
}

function removeProgressBar(player: alt.Player, uid: string) {
    alt.emitClient(player, SYSTEM_EVENTS.PROGRESSBAR_REMOVE, uid);
}

function sound2D(player: alt.Player, audioName: string, volume: number = 0.35) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_2D, audioName, volume);
}

function sound3D(player: alt.Player, audioName: string, target: alt.Entity): void {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_SOUND_3D, target, audioName);
}

function soundFrontend(player: alt.Player, audioName: string, ref: string): void {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_FRONTEND_SOUND, audioName, ref);
}

function taskTimeline(player: alt.Player, tasks: Array<Task | TaskCallback>) {
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
