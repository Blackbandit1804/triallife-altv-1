import * as alt from 'alt-server';
import { AudioStream } from '../../../shared/interfaces/audio';
import { Particle } from '../../../shared/interfaces/particle';
import { ProgressBar } from '../../../shared/interfaces/progress-bar';
import { Task, TaskCallback } from '../../../shared/interfaces/task-timeline';
import { AnimationFlag, SystemEvent } from '../../../shared/utility/enums';
import Logger from '../../utility/Logger';
import utility from './utility';

function animation(p: alt.Player, dictionary: string, name: string, flags: AnimationFlag, duration: number = -1): void {
    if (p.data.isUnconsciouse) {
        Logger.warning(`Cannot play ${dictionary}@${name} while player is unconsciouse.`);
        return;
    }
    alt.emitClient(p, SystemEvent.Animation_Play, dictionary, name, flags, duration);
}

function audioStream(stream: AudioStream) {
    alt.emitClient(null, 'audio:Stream', stream);
}

function meta(p: alt.Player, key: string, value: any): void {
    alt.nextTick(() => alt.emitClient(p, SystemEvent.Meta_Emit, key, value));
}

function message(p: alt.Player, message: string): void {
    alt.emitClient(p, SystemEvent.Hud_Message_Append, message);
}

function notification(p: alt.Player, message: string): void {
    alt.emitClient(p, SystemEvent.Hud_Notification_Show, message);
}

function particle(p: alt.Player, particle: Particle, emitToNearbyPlayers = false): void {
    if (!emitToNearbyPlayers) {
        alt.emitClient(p, SystemEvent.Hud_Particle_Play, particle);
        return;
    }
    const nearbyPlayers = utility.getClosestPlayers(p, 10);
    for (let i = 0; i < nearbyPlayers.length; i++) {
        const player = nearbyPlayers[i];
        alt.emitClient(player, SystemEvent.Hud_Particle_Play, particle);
    }
}

function createProgress(player: alt.Player, progressbar: ProgressBar) {
    alt.emitClient(player, SystemEvent.Hud_Progress_Create, progressbar);
}

function removeProgress(player: alt.Player, uid: string) {
    alt.emitClient(player, SystemEvent.Hud_Progress_Remove, uid);
}

function sound2D(p: alt.Player, audioName: string, volume: number = 0.35) {
    alt.emitClient(p, SystemEvent.Sound_2D, audioName, volume);
}

function sound3D(p: alt.Player, audioName: string, target: alt.Entity): void {
    alt.emitClient(p, SystemEvent.Sound_3D, target, audioName);
}

function soundFrontend(p: alt.Player, audioName: string, ref: string): void {
    alt.emitClient(p, SystemEvent.Sound_FrontEnd, audioName, ref);
}

function taskTimeline(player: alt.Player, tasks: Array<Task | TaskCallback>) {
    alt.emitClient(player, SystemEvent.Task_Timeline, tasks);
}

export default {
    animation,
    audioStream,
    createProgress,
    meta,
    message,
    notification,
    particle,
    removeProgress,
    sound2D,
    sound3D,
    soundFrontend,
    taskTimeline
};
