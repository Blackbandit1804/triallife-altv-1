export var EconomyTypes;
(function (EconomyTypes) {
    EconomyTypes["BANK"] = "bank";
    EconomyTypes["CASH"] = "cash";
})(EconomyTypes || (EconomyTypes = {}));
export var EffectTypes;
(function (EffectTypes) {
    EffectTypes["EFFECT_HEAL"] = "effect:Heal";
    EffectTypes["EFFECT_FOOD"] = "effect:Food";
    EffectTypes["EFFECT_WATER"] = "effect:Water";
    EffectTypes["EFFECT_MOOD"] = "effect:Mood";
})(EffectTypes || (EffectTypes = {}));
export var EquipmentType;
(function (EquipmentType) {
    EquipmentType[EquipmentType["HAT"] = 0] = "HAT";
    EquipmentType[EquipmentType["MASK"] = 1] = "MASK";
    EquipmentType[EquipmentType["SHIRT"] = 2] = "SHIRT";
    EquipmentType[EquipmentType["PANTS"] = 3] = "PANTS";
    EquipmentType[EquipmentType["FEET"] = 4] = "FEET";
    EquipmentType[EquipmentType["GLASSES"] = 5] = "GLASSES";
    EquipmentType[EquipmentType["EARS"] = 6] = "EARS";
    EquipmentType[EquipmentType["BAG"] = 7] = "BAG";
    EquipmentType[EquipmentType["ARMOUR"] = 8] = "ARMOUR";
})(EquipmentType || (EquipmentType = {}));
export var ItemType;
(function (ItemType) {
    ItemType[ItemType["NONE"] = 0] = "NONE";
    ItemType[ItemType["CAN_DROP"] = 1] = "CAN_DROP";
    ItemType[ItemType["CAN_STACK"] = 2] = "CAN_STACK";
    ItemType[ItemType["CAN_TRADE"] = 4] = "CAN_TRADE";
    ItemType[ItemType["IS_EQUIPMENT"] = 8] = "IS_EQUIPMENT";
    ItemType[ItemType["IS_TOOLBAR"] = 16] = "IS_TOOLBAR";
    ItemType[ItemType["IS_WEAPON"] = 32] = "IS_WEAPON";
    ItemType[ItemType["DESTROY_ON_DROP"] = 64] = "DESTROY_ON_DROP";
    ItemType[ItemType["CONSUMABLE"] = 128] = "CONSUMABLE";
    ItemType[ItemType["SKIP_CONSUMABLE"] = 256] = "SKIP_CONSUMABLE";
})(ItemType || (ItemType = {}));
export var SYSTEM_EVENTS;
(function (SYSTEM_EVENTS) {
    SYSTEM_EVENTS["APPEND_BLIP"] = "append:Blip";
    SYSTEM_EVENTS["APPEND_MARKER"] = "append:Marker";
    SYSTEM_EVENTS["APPEND_TEXTLABELS"] = "append:TextLabel";
    SYSTEM_EVENTS["BOOTUP_ENABLE_ENTRY"] = "enable:Entry";
    SYSTEM_EVENTS["INTERIOR_SWITCH"] = "interior:Switch";
    SYSTEM_EVENTS["INTERACTION"] = "player:Interact";
    SYSTEM_EVENTS["INTERACTION_ATM"] = "atm:Open";
    SYSTEM_EVENTS["INTERACTION_ATM_ACTION"] = "atm:Action";
    SYSTEM_EVENTS["INTERACTION_FUEL"] = "fuel:Action";
    SYSTEM_EVENTS["INTERACTION_JOB"] = "job:Interaction";
    SYSTEM_EVENTS["INTERACTION_JOB_ACTION"] = "job:Action";
    SYSTEM_EVENTS["META_SET"] = "meta:Set";
    SYSTEM_EVENTS["META_CHANGED"] = "meta:Changed";
    SYSTEM_EVENTS["NOCLIP_UPDATE"] = "noclip:Update";
    SYSTEM_EVENTS["NOCLIP_RESET"] = "noclip:Reset";
    SYSTEM_EVENTS["PLAYER_EMIT_ANIMATION"] = "animation:Play";
    SYSTEM_EVENTS["PLAYER_EMIT_AUDIO_STREAM"] = "audio:Stream";
    SYSTEM_EVENTS["PLAYER_EMIT_SOUND_2D"] = "sound:2D";
    SYSTEM_EVENTS["PLAYER_EMIT_SOUND_3D"] = "sound:3D";
    SYSTEM_EVENTS["PLAYER_EMIT_FRONTEND_SOUND"] = "sound:Frontend";
    SYSTEM_EVENTS["PLAYER_EMIT_NOTIFICATION"] = "notification:Show";
    SYSTEM_EVENTS["PLAYER_EMIT_TASK_MOVE"] = "task:Move";
    SYSTEM_EVENTS["PLAYER_EMIT_TASK_TIMELINE"] = "task:Timeline";
    SYSTEM_EVENTS["PLAYER_RELOAD"] = "player:ForceReload";
    SYSTEM_EVENTS["PLAYER_SET_FREEZE"] = "freeze:Set";
    SYSTEM_EVENTS["PLAYER_SET_DEATH"] = "death:Toggle";
    SYSTEM_EVENTS["PLAYER_SET_INTERACTION"] = "interaction:Set";
    SYSTEM_EVENTS["PLAYER_TICK"] = "player:Tick";
    SYSTEM_EVENTS["PLAYER_TOOLBAR_SET"] = "player:Toolbar";
    SYSTEM_EVENTS["PLAYER_ITEM_CHANGE"] = "player:ItemChange";
    SYSTEM_EVENTS["PLAY_PARTICLE_EFFECT"] = "ptfx:Play";
    SYSTEM_EVENTS["PROGRESSBAR_CREATE"] = "progressbar:Create";
    SYSTEM_EVENTS["PROGRESSBAR_REMOVE"] = "progressbar:Remove";
    SYSTEM_EVENTS["POPULATE_BLIPS"] = "blips:Populate";
    SYSTEM_EVENTS["POPULATE_MARKERS"] = "markers:Populate";
    SYSTEM_EVENTS["POPULATE_COMMANDS"] = "commands:Populate";
    SYSTEM_EVENTS["POPULATE_ITEMS"] = "items:Populate";
    SYSTEM_EVENTS["POPULATE_INTERACTIONS"] = "interactions:Populate";
    SYSTEM_EVENTS["POPULATE_TEXTLABELS"] = "POPULATE_TEXTLABELS";
    SYSTEM_EVENTS["QUICK_TOKEN_EMIT"] = "quicktoken:Emit";
    SYSTEM_EVENTS["QUICK_TOKEN_FETCH"] = "quicktoken:Fetch";
    SYSTEM_EVENTS["QUICK_TOKEN_NONE"] = "quicktoken:None";
    SYSTEM_EVENTS["QUICK_TOKEN_UPDATE"] = "quicktoken:Update";
    SYSTEM_EVENTS["REMOVE_MARKER"] = "remove:Marker";
    SYSTEM_EVENTS["REMOVE_BLIP"] = "remove:Blip";
    SYSTEM_EVENTS["REMOVE_TEXTLABEL"] = "remove:Textlabel";
    SYSTEM_EVENTS["SET_ACTION_MENU"] = "actions:Set";
    SYSTEM_EVENTS["TICKS_START"] = "ticks:Start";
    SYSTEM_EVENTS["VEHICLES_VIEW_SPAWN"] = "vehicles:Spawn";
    SYSTEM_EVENTS["VEHICLES_VIEW_DESPAWN"] = "vehicles:Despawn";
    SYSTEM_EVENTS["WORLD_UPDATE_TIME"] = "time:Update";
    SYSTEM_EVENTS["WORLD_UPDATE_WEATHER"] = "weather:Update";
    SYSTEM_EVENTS["VOICE_ADD"] = "voice:Add";
    SYSTEM_EVENTS["VOICE_JOINED"] = "voice:Joined";
})(SYSTEM_EVENTS || (SYSTEM_EVENTS = {}));
export var InventoryType;
(function (InventoryType) {
    InventoryType["INVENTORY"] = "inventory";
    InventoryType["EQUIPMENT"] = "equipment";
    InventoryType["TOOLBAR"] = "toolbar";
    InventoryType["GROUND"] = "ground";
    InventoryType["TAB"] = "tab";
})(InventoryType || (InventoryType = {}));
export var TeamType;
(function (TeamType) {
    TeamType["NONE"] = "none";
    TeamType["SUPPORTER"] = "supporter";
    TeamType["MODERATOR"] = "moderator";
    TeamType["ADMINISTRATOR"] = "Administrator";
    TeamType["OWNER"] = "owner";
})(TeamType || (TeamType = {}));
export var View_Events_Discord;
(function (View_Events_Discord) {
    View_Events_Discord["Close"] = "Discord:Close";
})(View_Events_Discord || (View_Events_Discord = {}));
export var View_Events_Creator;
(function (View_Events_Creator) {
    View_Events_Creator["Done"] = "creator:Done";
    View_Events_Creator["Close"] = "creator:Close";
    View_Events_Creator["Show"] = "creator:Show";
    View_Events_Creator["Sync"] = "creator:Sync";
    View_Events_Creator["AwaitModel"] = "creator:AwaitModel";
    View_Events_Creator["AwaitName"] = "creator:AwaitName";
})(View_Events_Creator || (View_Events_Creator = {}));
export var View_Events_Inventory;
(function (View_Events_Inventory) {
    View_Events_Inventory["Process"] = "inventory:Process";
    View_Events_Inventory["Use"] = "inventory:Use";
    View_Events_Inventory["Split"] = "inventory:Split";
    View_Events_Inventory["Pickup"] = "inventory:Pickup";
})(View_Events_Inventory || (View_Events_Inventory = {}));
export var View_Events_Clothing;
(function (View_Events_Clothing) {
    View_Events_Clothing["Open"] = "clothing:Open";
    View_Events_Clothing["Sync"] = "clothing:Sync";
    View_Events_Clothing["Purchase"] = "clothing:Purchase";
    View_Events_Clothing["Exit"] = "clothing:Exit";
})(View_Events_Clothing || (View_Events_Clothing = {}));
export var View_Events_Characters;
(function (View_Events_Characters) {
    View_Events_Characters["Select"] = "characters:Select";
    View_Events_Characters["Create"] = "characters:Create";
    View_Events_Characters["Show"] = "characters:Show";
    View_Events_Characters["Done"] = "characters:Done";
    View_Events_Characters["Delete"] = "characters:Delete";
})(View_Events_Characters || (View_Events_Characters = {}));
export var Vehicle_Lock_State;
(function (Vehicle_Lock_State) {
    Vehicle_Lock_State[Vehicle_Lock_State["NO_LOCK"] = 0] = "NO_LOCK";
    Vehicle_Lock_State[Vehicle_Lock_State["UNLOCKED"] = 1] = "UNLOCKED";
    Vehicle_Lock_State[Vehicle_Lock_State["LOCKED"] = 2] = "LOCKED";
    Vehicle_Lock_State[Vehicle_Lock_State["LOCKOUT_PLAYER"] = 3] = "LOCKOUT_PLAYER";
    Vehicle_Lock_State[Vehicle_Lock_State["KIDNAP_MODE"] = 4] = "KIDNAP_MODE";
})(Vehicle_Lock_State || (Vehicle_Lock_State = {}));
export const Vehicle_Lock_States = [Vehicle_Lock_State.UNLOCKED, Vehicle_Lock_State.LOCKED];
export var Vehicle_Seat_List;
(function (Vehicle_Seat_List) {
    Vehicle_Seat_List[Vehicle_Seat_List["DRIVER"] = -1] = "DRIVER";
    Vehicle_Seat_List[Vehicle_Seat_List["PASSENGER"] = 0] = "PASSENGER";
    Vehicle_Seat_List[Vehicle_Seat_List["DRIVER_REAR"] = 1] = "DRIVER_REAR";
    Vehicle_Seat_List[Vehicle_Seat_List["PASSENGER_REAR"] = 2] = "PASSENGER_REAR";
})(Vehicle_Seat_List || (Vehicle_Seat_List = {}));
export var Vehicle_Door_List;
(function (Vehicle_Door_List) {
    Vehicle_Door_List[Vehicle_Door_List["DRIVER"] = 0] = "DRIVER";
    Vehicle_Door_List[Vehicle_Door_List["PASSENGER"] = 1] = "PASSENGER";
    Vehicle_Door_List[Vehicle_Door_List["DRIVER_REAR"] = 2] = "DRIVER_REAR";
    Vehicle_Door_List[Vehicle_Door_List["PASSENGER_REAR"] = 3] = "PASSENGER_REAR";
    Vehicle_Door_List[Vehicle_Door_List["HOOD"] = 4] = "HOOD";
    Vehicle_Door_List[Vehicle_Door_List["TRUNK"] = 5] = "TRUNK";
})(Vehicle_Door_List || (Vehicle_Door_List = {}));
export var Vehicle_Behavior;
(function (Vehicle_Behavior) {
    Vehicle_Behavior[Vehicle_Behavior["CONSUMES_FUEL"] = 1] = "CONSUMES_FUEL";
    Vehicle_Behavior[Vehicle_Behavior["UNLIMITED_FUEL"] = 2] = "UNLIMITED_FUEL";
    Vehicle_Behavior[Vehicle_Behavior["NEED_KEY_TO_START"] = 4] = "NEED_KEY_TO_START";
    Vehicle_Behavior[Vehicle_Behavior["NO_KEY_TO_START"] = 8] = "NO_KEY_TO_START";
    Vehicle_Behavior[Vehicle_Behavior["NO_KEY_TO_LOCK"] = 16] = "NO_KEY_TO_LOCK";
    Vehicle_Behavior[Vehicle_Behavior["NO_SAVE"] = 32] = "NO_SAVE";
})(Vehicle_Behavior || (Vehicle_Behavior = {}));
export const Vehicle_Events = {
    SET_INTO: 'Vehicle-Set-Into',
    SET_LOCK: 'Vehicle-Set-Lock',
    SET_DOOR: 'Vehicle-Set-Door',
    SET_ENGINE: 'Vehicle-Set-Engine',
    SET_SEATBELT: 'Vehicle-Seatbelt'
};
export const Vehicle_State = {
    DOOR_DRIVER: `Door-${Vehicle_Door_List.DRIVER}`,
    DOOR_PASSENGER: `Door-${Vehicle_Door_List.PASSENGER}`,
    DOOR_DRIVER_REAR: `Door-${Vehicle_Door_List.DRIVER_REAR}`,
    DOOR_PASSENGER_REAR: `Door-${Vehicle_Door_List.PASSENGER_REAR}`,
    DOOR_HOOD: `Door-${Vehicle_Door_List.HOOD}`,
    DOOR_TRUNK: `Door-${Vehicle_Door_List.TRUNK}`,
    LOCK_STATE: `Door-Locks`,
    KEYS: `Vehicle-Keys`,
    OWNER: 'Vehicle-Owner',
    ENGINE: 'Vehicle-Engine',
    FUEL: 'Vehicle-Fuel'
};
export function inLockedState(state) {
    if (state === null || state === undefined)
        return true;
    if (state === Vehicle_Lock_State.LOCKED || state === Vehicle_Lock_State.LOCKOUT_PLAYER)
        return true;
    return false;
}
export const PhoneEvents = { EVENT: { name: 'phone:Event' }, ATM_TRANSFER: { name: 'phone:ATM:Transfer', isServer: true }, ATM_PROCESS: { name: 'phone:ATM:Process' } };
export const PhoneEventList = [PhoneEvents.EVENT, PhoneEvents.ATM_TRANSFER, PhoneEvents.ATM_PROCESS];
