import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/enums/system';

export class ToolbarManager {
    static handleToolbarSwitch(key: number) {
        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.isActionMenuOpen) {
            return;
        }

        if (alt.Player.local.isPhoneOpen) {
            return;
        }

        const slot: number = parseInt(String.fromCharCode(key)) - 1;
        const item = alt.Player.local.meta.toolbar.find((item) => item.slot === slot);

        if (!item) {
            alt.log(`No item in slot`);
            return;
        }

        alt.emitServer(SystemEvent.PLAYER_TOOLBAR_SET, slot);
    }
}
