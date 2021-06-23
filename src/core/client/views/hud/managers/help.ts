import * as alt from 'alt-client';
import { drawText3D } from '../../../utility/text';

export class HelpManager {
    private static key: number | null;
    private static helpShown: boolean = false;
    private static shortPress: string | null;
    private static longPress: string | null;
    private static interval: number;
    private static position: alt.Vector3;

    static updateHelpText(position: alt.Vector3, key: number | null, shortDesc: string | null, longDesc: string | null): void {
        if (!HelpManager.interval) HelpManager.interval = alt.setInterval(HelpManager.drawHelp, 0);
        HelpManager.key = key;
        HelpManager.longPress = longDesc;
        HelpManager.shortPress = shortDesc;
        HelpManager.helpShown = true;
        if (position) HelpManager.position = new alt.Vector3(position.x, position.y, alt.Player.local.pos.z);
        else HelpManager.position = null;
    }

    private static drawHelp() {
        if (!HelpManager.position) return;
        if (!HelpManager.shortPress && !HelpManager.longPress) return;
        HelpManager.drawKey();
        HelpManager.drawShortPress();
        HelpManager.drawLongPress();
    }

    private static drawKey() {
        if (!HelpManager.key) return;
        drawText3D(`[~g~${String.fromCharCode(HelpManager.key)}~w~]`, HelpManager.position, 0.5, new alt.RGBA(255, 255, 255, 255));
    }

    private static drawShortPress() {
        if (!HelpManager.shortPress) return;
        drawText3D(`~b~${HelpManager.shortPress}`, new alt.Vector3(HelpManager.position.x, HelpManager.position.y, HelpManager.position.z - 0.1), 0.5, new alt.RGBA(255, 255, 255, 255));
    }

    private static drawLongPress() {
        if (!HelpManager.longPress) return;
        drawText3D(`~b~${HelpManager.longPress}`, new alt.Vector3(HelpManager.position.x, HelpManager.position.y, HelpManager.position.z - 0.1 * 2), 0.5, new alt.RGBA(255, 255, 255, 255));
    }

    static isHelpShowing(): boolean {
        return this.helpShown;
    }
}
