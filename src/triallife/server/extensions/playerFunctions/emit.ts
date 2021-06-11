import * as alt from 'alt-server';
import { SystemEvent } from '../../../shared/enums/system';
import { AnimationFlag } from '../../../shared/enums/animation';
import { AudioStream } from '../../../shared/interfaces/Audio';
import { Particle } from '../../../shared/interfaces/Particle';
import { ProgressBar } from '../../../shared/interfaces/progress-bar';
import { Task, TaskCallback } from '../../../shared/interfaces/task-timeline';
import utility from './utility';

function animation(p: alt.Player, dictionary: string, name: string, flags: AnimationFlag, duration: number = -1): void {
    if (p.data.isUnconscious) {
        alt.logWarning(`[Athena] Cannot play ${dictionary}@${name} while player is dead.`);
        return;
    }

    alt.emitClient(p, SystemEvent.PLAYER_EMIT_ANIMATION, dictionary, name, flags, duration);
}

function audioStream(stream: AudioStream) {
    alt.emitClient(null, SystemEvent.PLAYER_EMIT_AUDIO_STREAM, stream);
}

function meta(p: alt.Player, key: string, value: any): void {
    alt.nextTick(() => {
        alt.emitClient(p, SystemEvent.META_SET, key, value);
    });
}

function notification(p: alt.Player, message: string): void {
    alt.emitClient(p, SystemEvent.PLAYER_EMIT_NOTIFICATION, message);
}

function particle(p: alt.Player, particle: Particle, emitToNearbyPlayers = false): void {
    if (!emitToNearbyPlayers) {
        alt.emitClient(p, SystemEvent.PLAY_PARTICLE_EFFECT, particle);
        return;
    }

    const nearbyPlayers = utility.getClosestPlayers(p, 10);
    for (let i = 0; i < nearbyPlayers.length; i++) {
        const player = nearbyPlayers[i];
        alt.emitClient(player, SystemEvent.PLAY_PARTICLE_EFFECT, particle);
    }
}

function createProgressBar(player: alt.Player, progressbar: ProgressBar) {
    alt.emitClient(player, SystemEvent.PROGRESSBAR_CREATE, progressbar);
}

function removeProgressBar(player: alt.Player, uid: string) {
    alt.emitClient(player, SystemEvent.PROGRESSBAR_REMOVE, uid);
}

function sound2D(p: alt.Player, audioName: string, volume: number = 0.35) {
    alt.emitClient(p, SystemEvent.PLAYER_EMIT_SOUND_2D, audioName, volume);
}

function sound3D(p: alt.Player, audioName: string, target: alt.Entity): void {
    alt.emitClient(p, SystemEvent.PLAYER_EMIT_SOUND_3D, target, audioName);
}

function soundFrontend(p: alt.Player, audioName: string, ref: string): void {
    alt.emitClient(p, SystemEvent.PLAYER_EMIT_FRONTEND_SOUND, audioName, ref);
}

function taskTimeline(player: alt.Player, tasks: Array<Task | TaskCallback>) {
    alt.emitClient(player, SystemEvent.PLAYER_EMIT_TASK_TIMELINE, tasks);
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
