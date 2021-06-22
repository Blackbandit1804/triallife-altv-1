export enum CurrencyTypes {
    BANK = 'bank',
    CASH = 'cash'
}

export enum EffectType {
    HEAL = 'effect:Heal',
    FOOD = 'effect:Food',
    WATER = 'effect:Water',
    MOOD = 'effect:Mood'
}

export enum EquipmentType {
    HAT = 0,
    MASK = 1,
    SHIRT = 2,
    PANTS = 3,
    FEET = 4,
    GLASSES = 5,
    EARS = 6,
    BAG = 7,
    ARMOUR = 8
}

export enum InventoryType {
    INVENTORY = 'inventory',
    EQUIPMENT = 'equipment',
    TOOLBAR = 'toolbar',
    GROUND = 'ground',
    TAB = 'tab'
}

export enum ItemType {
    NONE = 0,
    CAN_DROP = 1, // Not Implemented
    CAN_STACK = 2, // No Longer Relevant
    CAN_TRADE = 4, // Not Implemented
    IS_EQUIPMENT = 8,
    IS_TOOLBAR = 16,
    IS_WEAPON = 32,
    DESTROY_ON_DROP = 64, // Not Implemented
    CONSUMABLE = 128,
    SKIP_CONSUMABLE = 256
}

//#region vehicle
export enum LockState {
    NO_LOCK = 0,
    UNLOCKED = 1,
    LOCKED = 2,
    LOCKOUT_PLAYER = 3,
    KIDNAP_MODE = 4
}

export const LockStates: Array<LockState> = [LockState.UNLOCKED, LockState.LOCKED];

export enum SeatType {
    DRIVER = -1,
    PASSENGER = 0,
    DRIVER_REAR = 1,
    PASSENGER_REAR = 2
}

export enum DoorType {
    DRIVER = 0,
    PASSENGER = 1,
    DRIVER_REAR = 2,
    PASSENGER_REAR = 3,
    HOOD = 4,
    TRUNK = 5
}

export enum BehaviorState {
    CONSUMES_FUEL = 1,
    UNLIMITED_FUEL = 2,
    NEED_KEY_TO_START = 4,
    NO_KEY_TO_START = 8,
    NO_KEY_TO_LOCK = 16,
    NO_SAVE = 32
}

export enum VehicleEventType {
    SET_INTO = 'Vehicle-Set-Into',
    SET_LOCK = 'Vehicle-Set-Lock',
    SET_DOOR = 'Vehicle-Set-Door',
    SET_ENGINE = 'Vehicle-Set-Engine',
    SET_SEATBELT = 'Vehicle-Seatbelt'
}

export const DoorState = {
    DOOR_DRIVER: `Door-${DoorType.DRIVER}`,
    DOOR_PASSENGER: `Door-${DoorType.PASSENGER}`,
    DOOR_DRIVER_REAR: `Door-${DoorType.DRIVER_REAR}`,
    DOOR_PASSENGER_REAR: `Door-${DoorType.PASSENGER_REAR}`,
    DOOR_HOOD: `Door-${DoorType.HOOD}`,
    DOOR_TRUNK: `Door-${DoorType.TRUNK}`,
    LOCK_STATE: `Door-Locks`,
    KEYS: `Vehicle-Keys`,
    OWNER: 'Vehicle-Owner',
    ENGINE: 'Vehicle-Engine',
    FUEL: 'Vehicle-Fuel'
};

export function inLockedState(state: LockState): boolean {
    if (state === null || state === undefined) return true;
    if (state === LockState.LOCKED || state === LockState.LOCKOUT_PLAYER) return true;
    return false;
}
//#endregion
