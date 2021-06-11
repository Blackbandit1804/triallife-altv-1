export enum LockState {
    NO_LOCK = 0,
    UNLOCKED = 1,
    LOCKED = 2,
    LOCKOUT_PLAYER = 3,
    KIDNAP_MODE = 4
}

export enum SeatList {
    DRIVER = -1,
    PASSENGER = 0,
    DRIVER_REAR = 1,
    PASSENGER_REAR = 2
}

export enum DoorList {
    DRIVER = 0,
    PASSENGER = 1,
    DRIVER_REAR = 2,
    PASSENGER_REAR = 3,
    HOOD = 4,
    TRUNK = 5
}

export enum Behavior {
    CONSUMES_FUEL = 1,
    UNLIMITED_FUEL = 2,
    NEED_KEY_TO_START = 4,
    NO_KEY_TO_START = 8,
    NO_KEY_TO_LOCK = 16,
    NO_SAVE = 32
}

export enum VehicleEvent {
    SET_INTO = 'vehicle:SetInto',
    SET_LOCK = 'vehicle:SetLock',
    SET_DOOR = 'vehicle:SetDoor',
    SET_ENGINE = 'vehicle:SetEngine',
    SET_SEATBELT = 'vehicle:Seatbelt'
}

export enum VehicleDoorState {
    DOOR_DRIVER = `door:0`,
    DOOR_PASSENGER = `door:1`,
    DOOR_DRIVER_REAR = `door:2`,
    DOOR_PASSENGER_REAR = `door:3`,
    DOOR_HOOD = `door:4`,
    DOOR_TRUNK = `door:5`,
    LOCK_STATE = `door:Locks`,
    KEYS = `vehicle:Keys`,
    OWNER = 'vehicle:Owner',
    ENGINE = 'vehicle:Engine',
    FUEL = 'vehicle:Fuel'
}

export const LockStates: Array<LockState> = [LockState.UNLOCKED, LockState.LOCKED];

export function inLockedState(state: LockState): boolean {
    if (state === null || state === undefined) return true;
    if (state === LockState.LOCKED || state === LockState.LOCKOUT_PLAYER) return true;
    return false;
}
