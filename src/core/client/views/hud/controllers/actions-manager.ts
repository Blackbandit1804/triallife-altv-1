import * as alt from 'alt-client';
import { SystemEvent } from '../../../../shared/enums/system';
import { Action, ActionMenu } from '../../../../shared/interfaces/actions';
import { handleFrontendSound } from '../../../systems/sound';
import { BaseHUD } from '../hud';

export class ActionsManager {
    /**
     * Set the action menu instance.
     * Set to null to force-clear the menu.
     * @static
     * @param {(ActionMenu | null)} actionMenu
     * @return {*}
     * @memberof ActionManager
     */
    static set(actionMenu: ActionMenu) {
        if (!actionMenu) {
            BaseHUD.view.emit('actions:Set', null);
            return;
        }

        if (alt.Player.local.meta.isDead) {
            return;
        }

        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.isActionMenuOpen) {
            return;
        }

        alt.Player.local.isActionMenuOpen = true;
        BaseHUD.view.emit('actions:Set', actionMenu);
    }

    /**
     * Plays a sound when you navigate up and down.
     * @static
     * @memberof ActionManager
     */
    static navigate() {
        handleFrontendSound('NAV_UP_DOWN', 'HUD_FREEMODE_SOUNDSET');
    }

    /**
     * Plays a sound when you navigate left to right.
     * @static
     * @memberof ActionsManager
     */
    static leftRight() {
        handleFrontendSound('NAV_LEFT_RIGHT', 'HUD_FREEMODE_SOUNDSET');
    }

    /**
     * When the menu is closed or an option is slected.
     * @static
     * @memberof ActionManager
     */
    static closed() {
        alt.Player.local.isActionMenuOpen = false;
    }

    /**
     * Triggers the action selected by the user.
     * @static
     * @param {Action} action
     * @return {*}
     * @memberof ActionsManager
     */
    static trigger(action: Action) {
        ActionsManager.closed();
        handleFrontendSound('SELECT', 'HUD_FREEMODE_SOUNDSET');

        if (action.isServer) {
            alt.emitServer(action.eventName, action.data);
            return;
        }

        alt.emit(action.eventName, action.data);
    }
}

alt.onServer(SystemEvent.SET_ACTION_MENU, ActionsManager.set);
