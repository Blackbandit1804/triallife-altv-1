import { InteractionController } from '../systems/interaction';
export const KEY_BINDS = {
    INTERACTION_MODE: 18,
    TOOLBAR_ONE: 49,
    TOOLBAR_TWO: 50,
    TOOLBAR_THREE: 51,
    TOOLBAR_FOUR: 52,
    INTERACT: 69,
    VEHICLE_FUNCS: 70,
    VEHICLE_FUNCS_ALT: 71,
    INVENTORY: 73,
    VEHICLE_LOCK: 88,
    VEHICLE_ENGINE: 89,
    DEBUG_KEY: 112,
    LEADERBOARD: 113,
    PHONE: 190
};
const DELAY_BETWEEN_LONG_PRESSES = 800;
const DELAY_BETWEEN_PRESSES = 500;
const KEY_UP_BINDS = {
    [KEY_BINDS.DEBUG_KEY]: {
        singlePress: handleDebugMessages
    },
    [KEY_BINDS.LEADERBOARD]: {
        singlePress: LeaderboardController.focusLeaderBoard
    },
    [KEY_BINDS.INVENTORY]: {
        singlePress: InventoryController.handleView
    },
    [KEY_BINDS.VEHICLE_LOCK]: {
        singlePress: VehicleController.handleToggleLock
    },
    [KEY_BINDS.VEHICLE_ENGINE]: {
        singlePress: VehicleController.handleToggleEngine
    },
    [KEY_BINDS.VEHICLE_FUNCS]: {
        singlePress: (...args) => VehicleController.triggerVehicleFunction('pressedVehicleFunction')
    },
    [KEY_BINDS.VEHICLE_FUNCS_ALT]: {
        singlePress: (...args) => VehicleController.triggerVehicleFunction('pressedVehicleFunctionAlt')
    },
    [KEY_BINDS.INTERACT]: {
        singlePress: InteractionController.triggerInteraction
    },
    [KEY_BINDS.TOOLBAR_ONE]: {
        singlePress: ToolbarController.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_TWO]: {
        singlePress: ToolbarController.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_THREE]: {
        singlePress: ToolbarController.handleToolbarSwitch
    },
    [KEY_BINDS.TOOLBAR_FOUR]: {
        singlePress: ToolbarController.handleToolbarSwitch
    },
    [KEY_BINDS.PHONE]: {
        singlePress: PhoneController.togglePhone
    }
};