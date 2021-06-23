import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/utility/enums';
import { isAnyMenuOpen } from '../utility/menus';

export class ToolbarManager {
    static handleToolbarSwitch(key: number) {
        if (isAnyMenuOpen()) return;
        if (alt.Player.local.isPhoneOpen) return;
        const slot: number = parseInt(String.fromCharCode(key)) - 1;
        const item = alt.Player.local.meta.toolbar.find((item) => item.slot === slot);
        if (!item) {
            alt.log(`No item in slot`);
            return;
        }
        alt.emitServer(SystemEvent.Player_Toolbar, slot);
    }
}
