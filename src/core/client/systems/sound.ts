import * as alt from 'alt-client';
import * as native from 'natives';
import { SharedConfig } from '../../shared/configs/settings';
import { AudioStreamData } from '../../shared/interfaces/audio';
import { SystemEvent } from '../../shared/utility/enums';
import { distance } from '../../shared/utility/usefull';
import { HUD } from '../views/hud/hud';

let audioStreams: Array<AudioStreamData> = [];
let audioInterval: number;

alt.onServer(SystemEvent.Audio_Stream, handleAudioStream);
alt.onServer(SystemEvent.Sound_FrontEnd, handleFrontendSound);
alt.onServer(SystemEvent.Sound_3D, handlePlayAudio3D);
alt.onServer(SystemEvent.Sound_2D, handlePlayAudio2D);

export function handleFrontendSound(audioName: string, ref: string): void {
    native.playSoundFrontend(-1, audioName, ref, true);
}

export function handleAudioStream(audioStream: AudioStreamData) {
    alt.log(JSON.stringify(audioStream));
    if (audioInterval) {
        alt.clearInterval(audioInterval);
        audioInterval = null;
    }
    audioStream.endTime = Date.now() + audioStream.duration;
    audioStreams.push(audioStream);
    audioInterval = alt.setInterval(playClosestStream, 500);
}

export function playClosestStream() {
    if (audioStreams.length <= 0) return;
    for (let i = audioStreams.length - 1; i > 0; i--) {
        const stream = audioStreams[i];
        if (!stream) continue;
        if (Date.now() < stream.endTime) continue;
        audioStreams.splice(i, 1);
        continue;
    }
    const relevantStreams = audioStreams.filter((stream) => {
        if (distance(stream.position, alt.Player.local.pos) <= SharedConfig.MAX_AUDIO_STREAM_DISTANCE) return true;
        return false;
    });
    if (relevantStreams.length <= 0) {
        HUD.pauseStreamPlayer();
        return;
    }
    let closestDistance = distance(relevantStreams[0].position, alt.Player.local.pos);
    let closestStream = relevantStreams[0];
    for (let i = 0; i < relevantStreams.length; i++) {
        const stream = relevantStreams[i];
        const dist = distance(stream.position, alt.Player.local.pos);
        if (dist > closestDistance) continue;
        closestDistance = dist;
        closestStream = stream;
    }
    const volume = SharedConfig.MAX_AUDIO_STREAM_DISTANCE - closestDistance;
    const timeLeft = closestStream.duration - (closestStream.endTime - Date.now());
    if (timeLeft <= 1000) return;
    HUD.adjustStreamPlayer(closestStream.streamName, volume, timeLeft / 1000);
}

function handlePlayAudio3D(entity: alt.Entity, soundName: string): void {
    if (!entity || !soundName) return;
    const dist = distance(entity.pos, alt.Player.local.pos);
    let volume = 0.35;
    let pan = 0;
    if (alt.Player.local.scriptID !== entity.scriptID) {
        if (!native.isEntityOnScreen(entity.scriptID)) volume -= 0.25;
        else {
            const pos = entity.pos;
            const [_, x, y] = native.getScreenCoordFromWorldCoord(pos.x, pos.y, pos.z, undefined, undefined);
            pan = x * 2 - 1;
            volume = dist / 100 / 0.35;
        }
    } else volume = 0.35;
    if (pan < -1) pan = -1;
    if (pan > 1) pan = 1;
    if (volume > 1) volume = 1;
    alt.emit('hud:PlayAudio3D', soundName, pan, volume);
}

function handlePlayAudio2D(soundName: string, volume: number = 0.35) {
    alt.emit('hud:PlayAudio3D', soundName, 0, volume);
}
