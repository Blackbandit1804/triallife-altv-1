export var EVENTS_VEHICLE;
(function (EVENTS_VEHICLE) {
    EVENTS_VEHICLE["DESPAWNED"] = "tlrp:VehicleDespawned";
    EVENTS_VEHICLE["ENGINE_STATE_CHANGE"] = "tlrp:VehicleEngineState";
    EVENTS_VEHICLE["LOCK_STATE_CHANGE"] = "tlrp:VehicleLockState";
    EVENTS_VEHICLE["LIGHT_STATE_CHANGE"] = "tlrp:VehicleLightState";
    EVENTS_VEHICLE["SPAWNED"] = "tlrp:VehicleSpawned";
    EVENTS_VEHICLE["REPAIRED"] = "tlrp:VehicleRepaired";
})(EVENTS_VEHICLE || (EVENTS_VEHICLE = {}));
export var EVENTS_PLAYER;
(function (EVENTS_PLAYER) {
    EVENTS_PLAYER["UNCONSCIOUS"] = "tlrp:PlayerUnconscious";
    EVENTS_PLAYER["DROPPED_ITEM"] = "tlrp:PlayerDroppedItem";
    EVENTS_PLAYER["SELECTED_CHARACTER"] = "tlrp:SelectedCharacter";
    EVENTS_PLAYER["SPAWNED"] = "tlrp:PlayerSpawned";
})(EVENTS_PLAYER || (EVENTS_PLAYER = {}));
