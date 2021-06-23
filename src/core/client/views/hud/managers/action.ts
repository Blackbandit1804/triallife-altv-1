import * as alt from 'alt-client';
import { Action, ActionMenu } from '../../../../shared/interfaces/action';
import { SystemEvent } from '../../../../shared/utility/enums';
import { handleFrontendSound } from '../../../systems/sound';
import { HUD } from '../hud';

export class ActionManager {
    static set(actionMenu: ActionMenu) {
        if (!actionMenu) {
            HUD.view.emit('actions:Set', null);
            return;
        }
        if (alt.Player.local.meta.isUnconsciouse) return;
        if (alt.Player.local.isMenuOpen) return;
        if (alt.Player.local.isActionMenuOpen) return;
        alt.Player.local.isActionMenuOpen = true;
        HUD.view.emit('actions:Set', actionMenu);
    }

    static navigate() {
        handleFrontendSound('NAV_UP_DOWN', 'HUD_FREEMODE_SOUNDSET');
    }

    static leftRight() {
        handleFrontendSound('NAV_LEFT_RIGHT', 'HUD_FREEMODE_SOUNDSET');
    }

    static closed() {
        alt.Player.local.isActionMenuOpen = false;
    }

    static trigger(action: Action) {
        ActionManager.closed();
        handleFrontendSound('SELECT', 'HUD_FREEMODE_SOUNDSET');
        if (action.isServer) {
            alt.emitServer(action.eventName, action.data);
            return;
        }
        alt.emit(action.eventName, action.data);
    }
}

alt.onServer(SystemEvent.Actions_Set, ActionManager.set);
