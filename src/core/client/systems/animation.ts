import * as alt from 'alt-client';
import * as native from 'natives';
import { SystemEvent, AnimationFlag } from '../../shared/utility/enums';

alt.onServer(SystemEvent.Animation_Play, playAnimation);

async function loadAnimation(dict: string, count: number = 0): Promise<boolean> {
    return new Promise((resolve: Function): void => {
        const interval = alt.setInterval(() => {
            count += 1;
            if (native.hasAnimDictLoaded(dict)) {
                alt.clearInterval(interval);
                resolve(true);
                return;
            }
            if (count >= 25) {
                alt.clearInterval(interval);
                resolve(false);
                return;
            }
            native.requestAnimDict(dict);
        }, 250);
    });
}

export async function playAnimation(dict: string, name: string, flags: AnimationFlag = AnimationFlag.CANCELABLE, duration: number = -1): Promise<void> {
    const isReadyToPlay = await loadAnimation(dict);
    if (!isReadyToPlay) return;
    if (alt.Player.local.meta.isUnconsciouse) return;
    if (native.isEntityPlayingAnim(alt.Player.local.scriptID, dict, name, 3)) return;
    native.taskPlayAnim(alt.Player.local.scriptID, dict, name, 8.0, -1, duration, flags, 0, false, false, false);
}
