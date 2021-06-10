export enum Permissions {
    None = 0,
    Supporter = 1,
    Moderator = 2,
    Admin = 4,
    Owner = 8
}

export enum AnimationFlags {
    NORMAL = 0,
    REPEAT = 1,
    STOP_LAST_FRAME = 2,
    UPPERBODY_ONLY = 16,
    ENABLE_PLAYER_CONTROL = 32,
    CANCELABLE = 120
}

export enum EquipmentTypes {
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

export enum ItemTypes {
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

export enum InventoryTypes {
    INVENTORY = 'inventory',
    EQUIPMENT = 'equipment',
    TOOLBAR = 'toolbar',
    GROUND = 'ground',
    TAB = 'tab'
}

export enum EconomyTypes {
    BANK = 'bank',
    CASH = 'cash'
}

export enum EffectTypes {
    EFFECT_HEAL = 'effect:Heal',
    EFFECT_FOOD = 'effect:Food',
    EFFECT_WATER = 'effect:Water',
    EFFECT_MOOD = 'effect:Mood'
}

//#region Vehicle
export enum LockTypes {
    NO_LOCK = 0,
    UNLOCKED = 1,
    LOCKED = 2,
    LOCKOUT_PLAYER = 3,
    KIDNAP_MODE = 4
}

export const LockType: Array<LockTypes> = [LockTypes.UNLOCKED, LockTypes.LOCKED];

export enum SeatTypes {
    DRIVER = -1,
    PASSENGER = 0,
    DRIVER_REAR = 1,
    PASSENGER_REAR = 2
}

export enum DoorTypes {
    DRIVER = 0,
    PASSENGER = 1,
    DRIVER_REAR = 2,
    PASSENGER_REAR = 3,
    HOOD = 4,
    TRUNK = 5
}

export enum BehaviorTypes {
    CONSUMES_FUEL = 1,
    UNLIMITED_FUEL = 2,
    NEED_KEY_TO_START = 4,
    NO_KEY_TO_START = 8,
    NO_KEY_TO_LOCK = 16,
    NO_SAVE = 32
}

export const VehicleEvents = {
    SET_INTO: 'Vehicle-Set-Into',
    SET_LOCK: 'Vehicle-Set-Lock',
    SET_DOOR: 'Vehicle-Set-Door',
    SET_ENGINE: 'Vehicle-Set-Engine',
    SET_SEATBELT: 'Vehicle-Seatbelt'
};

export const VehicleStates = {
    DOOR_DRIVER: `Door-${DoorTypes.DRIVER}`,
    DOOR_PASSENGER: `Door-${DoorTypes.PASSENGER}`,
    DOOR_DRIVER_REAR: `Door-${DoorTypes.DRIVER_REAR}`,
    DOOR_PASSENGER_REAR: `Door-${DoorTypes.PASSENGER_REAR}`,
    DOOR_HOOD: `Door-${DoorTypes.HOOD}`,
    DOOR_TRUNK: `Door-${DoorTypes.TRUNK}`,
    LOCK_STATE: `Door-Locks`,
    KEYS: `Vehicle-Keys`,
    OWNER: 'Vehicle-Owner',
    ENGINE: 'Vehicle-Engine',
    FUEL: 'Vehicle-Fuel'
};

export function inLockedState(state: LockTypes): boolean {
    if (state === null || state === undefined) return true;
    if (state === LockTypes.LOCKED || state === LockTypes.LOCKOUT_PLAYER) return true;
    return false;
}
//#endregion

//#region phone
interface PhoneEvent {
    name: string;
    isServer?: boolean;
}

export const PhoneEvents = { EVENT: { name: 'phone:Event' }, ATM_TRANSFER: { name: 'phone:ATM:Transfer', isServer: true }, ATM_PROCESS: { name: 'phone:ATM:Process' } };
export const PhoneEventList: Array<PhoneEvent> = [PhoneEvents.EVENT, PhoneEvents.ATM_TRANSFER, PhoneEvents.ATM_PROCESS];
//#endregion

//#region system
export enum SYSTEM_EVENTS {
    APPEND_BLIP = 'append:Blip',

    APPEND_MARKER = 'append:Marker',

    APPEND_TEXTLABELS = 'append:TextLabel',

    BOOTUP_ENABLE_ENTRY = 'enable:Entry',

    INTERIOR_SWITCH = 'interior:Switch',

    INTERACTION = 'player:Interact',
    INTERACTION_ATM = 'atm:Open',
    INTERACTION_ATM_ACTION = 'atm:Action',
    INTERACTION_FUEL = 'fuel:Action',
    INTERACTION_JOB = 'job:Interaction',
    INTERACTION_JOB_ACTION = 'job:Action',

    META_SET = 'meta:Set',
    META_CHANGED = 'meta:Changed',

    NOCLIP_UPDATE = 'noclip:Update',
    NOCLIP_RESET = 'noclip:Reset',

    PLAYER_EMIT_ANIMATION = 'animation:Play',
    PLAYER_EMIT_AUDIO_STREAM = 'audio:Stream',
    PLAYER_EMIT_SOUND_2D = 'sound:2D',
    PLAYER_EMIT_SOUND_3D = 'sound:3D',
    PLAYER_EMIT_FRONTEND_SOUND = 'sound:Frontend',
    PLAYER_EMIT_NOTIFICATION = 'notification:Show',
    PLAYER_EMIT_TASK_MOVE = 'task:Move',
    PLAYER_EMIT_TASK_TIMELINE = 'task:Timeline',
    PLAYER_RELOAD = 'player:ForceReload',
    PLAYER_SET_FREEZE = 'freeze:Set',
    PLAYER_SET_DEATH = 'death:Toggle',
    PLAYER_SET_INTERACTION = 'interaction:Set',
    PLAYER_TICK = 'player:Tick',
    PLAYER_TOOLBAR_SET = 'player:Toolbar',
    PLAYER_ITEM_CHANGE = 'player:ItemChange',

    PLAY_PARTICLE_EFFECT = 'ptfx:Play',

    PROGRESSBAR_CREATE = 'progressbar:Create',
    PROGRESSBAR_REMOVE = 'progressbar:Remove',

    POPULATE_BLIPS = 'blips:Populate',
    POPULATE_MARKERS = 'markers:Populate',
    POPULATE_COMMANDS = 'commands:Populate',
    POPULATE_ITEMS = 'items:Populate',
    POPULATE_INTERACTIONS = 'interactions:Populate',
    POPULATE_TEXTLABELS = 'POPULATE_TEXTLABELS',

    QUICK_TOKEN_EMIT = 'quicktoken:Emit',
    QUICK_TOKEN_FETCH = 'quicktoken:Fetch',
    QUICK_TOKEN_NONE = 'quicktoken:None',
    QUICK_TOKEN_UPDATE = 'quicktoken:Update',

    REMOVE_MARKER = 'remove:Marker',
    REMOVE_BLIP = 'remove:Blip',
    REMOVE_TEXTLABEL = 'remove:Textlabel',

    SET_ACTION_MENU = 'actions:Set',

    TICKS_START = 'ticks:Start',

    VEHICLES_VIEW_SPAWN = 'vehicles:Spawn',
    VEHICLES_VIEW_DESPAWN = 'vehicles:Despawn',

    WORLD_UPDATE_TIME = 'time:Update',
    WORLD_UPDATE_WEATHER = 'weather:Update',

    VOICE_ADD = 'voice:Add',
    VOICE_REMOVE = 'voice:Remove',
    VOICE_JOINED = 'voice:Joined'
}
//#endregion

//#region views
export enum ViewEventsDiscord {
    Close = 'Discord:Close'
}

export enum ViewEventsCreator {
    Done = 'creator:Done',
    Close = 'creator:Close',
    Show = 'creator:Show',
    Sync = 'creator:Sync',
    AwaitModel = 'creator:AwaitModel',
    AwaitName = 'creator:AwaitName'
}

export enum ViewEventsInventory {
    Process = 'inventory:Process',
    Use = 'inventory:Use',
    Split = 'inventory:Split',
    Pickup = 'inventory:Pickup'
}

export enum ViewEventsClothing {
    Open = 'clothing:Open',
    Sync = 'clothing:Sync',
    Purchase = 'clothing:Purchase',
    Exit = 'clothing:Exit'
}

export enum ViewEventsCharacters {
    Select = 'characters:Select',
    New = 'characters:New',
    Show = 'characters:Show',
    Done = 'characters:Done',
    Delete = 'characters:Delete'
}

export enum ViewEventsChat {
    Send = 'chat:Send',
    Append = 'chat:Append'
}
//#endregion
