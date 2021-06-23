import * as alt from 'alt-client';
import { HUD } from '../hud';

export class AudioManager {
    static handle3DAudio(soundName: string, pan: number, volume: number): void {
        if (!HUD.view) return;
        HUD.view.emit('hud:Audio3D', soundName, pan, volume);
    }
}

alt.on('hud:PlayAudio3D', AudioManager.handle3DAudio);
