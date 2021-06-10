export enum Collections {
    Accounts = 'accounts',
    Characters = 'characters',
    Interiors = 'interiors',
    Options = 'options'
}

export enum EVENTS_VEHICLE {
    DESPAWNED = 'tlrp:VehicleDespawned',
    ENGINE_STATE_CHANGE = 'tlrp:VehicleEngineState',
    LOCK_STATE_CHANGE = 'tlrp:VehicleLockState',
    SPAWNED = 'tlrp:VehicleSpawned',
    REPAIRED = 'tlrp:VehicleRepaired'
}

export enum EVENTS_PLAYER {
    UNCONSCIOUS = 'tlrp:PlayerUnconscious',
    DROPPED_ITEM = 'tlrp:PlayerDroppedItem',
    SELECTED_CHARACTER = 'tlrp:SelectedCharacter',
    SPAWNED = 'tlrp:PlayerSpawned'
}
