import * as alt from 'alt-client';
import * as native from 'natives';
import { SystemEvent } from '../../shared/enums/system';
import { InteractionManager } from '../systems/interaction';
import { ToolbarManager } from '../systems/toolbar';
import { VehicleManager } from '../systems/vehicle';
import { ChatManager } from '../views/hud/controllers/chatManager';
import { HelpManager } from '../views/hud/controllers/helpManager';
import { LeaderboardManager } from '../views/hud/controllers/leaderBoardManager';
import { PhoneManager } from '../views/hud/controllers/phoneManager';
import { InventoryManager } from '../views/inventory/inventory';

export const KEY_BINDS = {
    // Left Alt
    INTERACTION_MODE: 18,
    // 1 - 4
    TOOLBAR_ONE: 49,
    TOOLBAR_TWO: 50,
    TOOLBAR_THREE: 51,
    TOOLBAR_FOUR: 52,
    // E
    INTERACT: 69,
    // F
    VEHICLE_FUNCS: 70, // Driver
    VEHICLE_FUNCS_ALT: 71, // Passenger
    // I
    INVENTORY: 73,
    // T
    CHAT: 84,
    // X
    VEHICLE_LOCK: 88,
    // Y
    VEHICLE_ENGINE: 89,
    // F1
    DEBUG_KEY: 112,
    // F2
    LEADERBOARD: 113,
    // . or >
    PHONE: 190
};

const DELAY_BETWEEN_LONG_PRESSES = 800;
const DELAY_BETWEEN_PRESSES = 500;
const KEY_UP_BINDS = {
    [KEY_BINDS.DEBUG_KEY]: {
        singlePress: handleDebugMessages
    },
    [KEY_BINDS.LEADERBOARD]: {
        singlePress: LeaderboardManager.focusLeaderBoard
    },
    [KEY_BINDS.INVENTORY]: {
        singlePress: InventoryManager.handleView
    },
    [KEY_BINDS.VEHICLE_LOCK]: {
        singlePress: VehicleManager.handleToggleLock
    },
    [KEY_BINDS.VEHICLE_ENGINE]: {
        singlePress: VehicleManager.handleToggleEngine
    },
    [KEY_BINDS.VEHICLE_FUNCS]: {
        singlePress: (...args: any[]) => VehicleManager.triggerVehicleFunction('pressedVehicleFunction')
    },
    [KEY_BINDS.VEHICLE_FUNCS_ALT]: {
        singlePress: (...args: any[]) => VehicleManager.triggerVehicleFunction('pressedVehicleFunctionAlt')
    },
    [KEY_BINDS.CHAT]: {
        singlePress: ChatManager.focusChat
    },
    [KEY_BINDS.INTERACT]: {
        singlePress: InteractionManager.triggerInteraction
    },
    [KEY_BINDS.TOOLBAR_ONE]: {
        singlePress: ToolbarManager.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_TWO]: {
        singlePress: ToolbarManager.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_THREE]: {
        singlePress: ToolbarManager.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_FOUR]: {
        singlePress: ToolbarManager.handleToolbarSwitch
    },
    [KEY_BINDS.PHONE]: {
        singlePress: PhoneManager.togglePhone
    }
};

let keyPressTimes = {};
let nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

alt.onServer(SystemEvent.TICKS_START, startKeyListeners);

function startKeyListeners() {
    alt.on('keyup', handleKeyUp);
    alt.on('keydown', handleKeyDown);
}

function handleKeyDown(key: number) {
    if (alt.Player.local.isMenuOpen) {
        return;
    }

    keyPressTimes[key] = Date.now();

    if (!KEY_UP_BINDS[key]) {
        return;
    }

    if (!KEY_UP_BINDS[key]['longpress']) {
        return;
    }

    alt.setTimeout(() => {
        if (!keyPressTimes[key]) {
            return;
        }

        keyPressTimes[key] = null;

        if (KEY_UP_BINDS[key]['longpress']) {
            KEY_UP_BINDS[key]['longpress'](key);
        }
    }, DELAY_BETWEEN_LONG_PRESSES);
}

function handleKeyUp(key: number) {
    if (!KEY_UP_BINDS[key]) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (Date.now() < nextKeyPress) {
        return;
    }

    nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

    if (keyPressTimes[key] === null) {
        return;
    }

    keyPressTimes[key] = null;

    // Long Press
    const isLongPressReady = keyPressTimes[key] + DELAY_BETWEEN_LONG_PRESSES < Date.now();
    if (keyPressTimes[key] && isLongPressReady && KEY_UP_BINDS[key]['longpress']) {
        KEY_UP_BINDS[key]['longpress'](key);
    }

    // Single Press
    if (KEY_UP_BINDS[key] && KEY_UP_BINDS[key].singlePress) {
        KEY_UP_BINDS[key].singlePress(key);
    }
}

function handleDebugMessages() {
    alt.log(`POSITION:`);
    const pos = { ...alt.Player.local.pos };
    alt.log(JSON.stringify(pos));

    alt.log(`ROTATION:`);
    const rot = { ...alt.Player.local.rot };
    alt.log(JSON.stringify(rot));

    alt.log(`HEADING:`);
    const heading = native.getEntityHeading(alt.Player.local.scriptID);
    alt.log(heading);

    if (alt.Player.local.isAiming) {
        alt.log(`AIM POSITION:`);
        const aimPos = alt.Player.local.aimPos;
        alt.log(JSON.stringify(aimPos));
    }

    alt.emit('debug:Time');
}
