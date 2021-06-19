import * as alt from 'alt-client';
import * as native from 'natives';

export function handleFrontendSound(audioName: string, ref: string): void {
    native.playSoundFrontend(-1, audioName, ref, true);
}
