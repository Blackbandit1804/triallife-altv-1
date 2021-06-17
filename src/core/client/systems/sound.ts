import * as alt from 'alt-client';
import * as natives from 'natives';
import { AudioStreamData } from '../../shared/interfaces/audio';
import { distance } from '../../shared/utility/usefull';

let audioStreams: Array<AudioStreamData> = [];
let audioInterval: number;

export function handleFrontendSound(audioName: string, ref: string): void {
    natives.playSoundFrontend(-1, audioName, ref, true);
}
