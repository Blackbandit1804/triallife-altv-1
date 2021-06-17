import * as alt from 'alt-client';
import * as natives from 'natives';

alt.on('connectionComplete', async () => {
    natives.destroyAllCams(true);
    natives.renderScriptCams(false, false, 0, false, false, false);
    natives.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
    natives.doScreenFadeOut(0);
    natives.triggerScreenblurFadeOut(0);
    natives.freezeEntityPosition(alt.Player.local.scriptID, true);
});

alt.on('disconnect', () => {
    natives.stopAudioScenes();
    natives.freezeEntityPosition(alt.Player.local.scriptID, false);
});
