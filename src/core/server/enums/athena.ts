/**
 * First argument from an `alt.on` event should always be a vehicle.
 * @export
 * @enum {number}
 */
export enum ATHENA_EVENTS_VEHICLE {
    DESPAWNED = 'tlrp:VehicleDespawned',
    ENGINE_STATE_CHANGE = 'tlrp:VehicleEngineState',
    LOCK_STATE_CHANGE = 'tlrp:VehicleLockState',
    SPAWNED = 'tlrp:VehicleSpawned',
    REPAIRED = 'tlrp:VehicleRepaired'
}

/**
 * First argument from an `alt.on` event should always be a player.
 * Server-side only.
 * @export
 * @enum {number}
 */
export enum ATHENA_EVENTS_PLAYER {
    DIED = 'tlrp:PlayerDied',
    DROPPED_ITEM = 'tlrp:PlayerDroppedItem',
    SELECTED_CHARACTER = 'tlrp:SelectedCharacter',
    SPAWNED = 'tlrp:PlayerSpawned'
}
