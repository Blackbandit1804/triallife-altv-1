import * as alt from 'alt-client';
import * as native from 'natives';
import { SystemEvent } from '../../shared/utility/enums';
import { InteractionManager } from '../systems/interaction';
import { InventoryManager } from '../views/inventory/inventory';
import { ToolbarManager } from '../systems/toolbar';
import { VehicleManager } from '../systems/vehicle';
import { FromClient } from '../views/voice/salty-chat';

const DELAY_BETWEEN_LONG_PRESSES = 800;
const DELAY_BETWEEN_PRESSES = 500;

alt.on('connectionComplete', async () => {
    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, false);
    native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
    native.doScreenFadeOut(0);
    native.triggerScreenblurFadeOut(0);
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    native.displayRadar(false);
    native.setMinimapComponent(15, true, 0);
    if (alt.beginScaleformMovieMethodMinimap('SETUP_HEALTH_ARMOUR')) {
        native.scaleformMovieMethodAddParamInt(3);
        native.endScaleformMovieMethod();
    }
});

alt.on('disconnect', () => {
    native.stopAudioScenes();
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
});

export const KEY_BINDS = {
    TOOLBAR_ONE: 49, // 1
    TOOLBAR_TWO: 50, // 2
    TOOLBAR_THREE: 51, // 3
    TOOLBAR_FOUR: 52, // 4
    TOOLBAR_FIVE: 53, // 5
    INTERACT: 69, // E
    VEHICLE_FUNCS: 70, // F - Driver
    VEHICLE_FUNCS_ALT: 71, // G - Passenger
    INVENTORY: 73, // I
    VEHICLE_LOCK: 85, // U
    VEHICLE_ENGINE: 77, // M
    DEBUG_KEY: 112, // F1
    ADMINPANEL: 113, // F2
    PHONE: 190, // . or >
    VOICE: 220 // . or >
};

const KEY_UP_BINDS = {
    [KEY_BINDS.DEBUG_KEY]: { singlePress: handleDebugMessages },
    [KEY_BINDS.INVENTORY]: { singlePress: InventoryManager.handleView },
    [KEY_BINDS.VEHICLE_LOCK]: { singlePress: VehicleManager.handleToggleLock },
    [KEY_BINDS.VEHICLE_ENGINE]: { singlePress: VehicleManager.handleToggleEngine },
    [KEY_BINDS.VEHICLE_FUNCS]: { singlePress: (...args: any[]) => VehicleManager.triggerVehicleFunction('pressedVehicleFunction') },
    [KEY_BINDS.VEHICLE_FUNCS_ALT]: { singlePress: (...args: any[]) => VehicleManager.triggerVehicleFunction('pressedVehicleFunctionAlt') },
    [KEY_BINDS.INTERACT]: { singlePress: InteractionManager.triggerInteraction },
    [KEY_BINDS.TOOLBAR_ONE]: { singlePress: ToolbarManager.handleToolbarSwitch },
    [KEY_BINDS.TOOLBAR_TWO]: { singlePress: ToolbarManager.handleToolbarSwitch },
    [KEY_BINDS.TOOLBAR_THREE]: { singlePress: ToolbarManager.handleToolbarSwitch },
    [KEY_BINDS.TOOLBAR_FOUR]: { singlePress: ToolbarManager.handleToolbarSwitch },
    [KEY_BINDS.TOOLBAR_FIVE]: { singlePress: ToolbarManager.handleToolbarSwitch },
    [KEY_BINDS.VOICE]: { singlePress: handleVoiceChange }
    //[KEY_BINDS.PHONE]: { singlePress: PhoneManager.togglePhone }
};

let keyPressTimes = {};
let nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;

alt.onServer(SystemEvent.Ticks_Start, () => {
    alt.on('keyup', handleKeyUp);
    alt.on('keydown', handleKeyDown);
    alt.everyTick(() => handleIdleCam());
});

function handleDebugMessages(key: number) {
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

function handleVoiceChange(key: number) {
    alt.emit(FromClient.toggleRange);
}

function handleKeyDown(key: number) {
    if (alt.Player.local.isMenuOpen) return;
    keyPressTimes[key] = Date.now();
    if (!KEY_UP_BINDS[key]) return;
    if (!KEY_UP_BINDS[key]['longPress']) return;
    alt.setTimeout(() => {
        if (!keyPressTimes[key]) return;
        keyPressTimes[key] = null;
        if (KEY_UP_BINDS[key]['longPress']) KEY_UP_BINDS[key]['longPress'](key);
    }, DELAY_BETWEEN_LONG_PRESSES);
}

function handleKeyUp(key: number) {
    if (!KEY_UP_BINDS[key]) return;
    if (alt.Player.local.isMenuOpen) return;
    if (Date.now() < nextKeyPress) return;
    nextKeyPress = Date.now() + DELAY_BETWEEN_PRESSES;
    if (keyPressTimes[key] === null) return;
    keyPressTimes[key] = null;
    const isLongPressReady = keyPressTimes[key] + DELAY_BETWEEN_LONG_PRESSES < Date.now();
    if (keyPressTimes[key] && isLongPressReady && KEY_UP_BINDS[key]['longPress']) KEY_UP_BINDS[key]['longPress'](key);
    if (KEY_UP_BINDS[key] && KEY_UP_BINDS[key].singlePress) KEY_UP_BINDS[key].singlePress(key);
}

function handleIdleCam() {
    native.invalidateIdleCam();
    native.invalidateVehicleIdleCam();
}
