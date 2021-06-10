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
    //
    PLAYER_TOOLBAR_SET = 'player:Toolbar',
    PLAYER_ITEM_CHANGE = 'player:ItemChange',
    //
    PLAY_PARTICLE_EFFECT = 'ptfx:Play',
    // Progress Bar
    PROGRESSBAR_CREATE = 'progressbar:Create',
    PROGRESSBAR_REMOVE = 'progressbar:Remove',
    //
    POPULATE_BLIPS = 'blips:Populate',
    POPULATE_MARKERS = 'markers:Populate',
    POPULATE_COMMANDS = 'commands:Populate',
    POPULATE_ITEMS = 'items:Populate',
    POPULATE_INTERACTIONS = 'interactions:Populate',
    POPULATE_TEXTLABELS = 'POPULATE_TEXTLABELS',
    //
    QUICK_TOKEN_EMIT = 'quicktoken:Emit',
    QUICK_TOKEN_FETCH = 'quicktoken:Fetch',
    QUICK_TOKEN_NONE = 'quicktoken:None',
    QUICK_TOKEN_UPDATE = 'quicktoken:Update',
    //
    REMOVE_MARKER = 'remove:Marker',
    REMOVE_BLIP = 'remove:Blip',
    REMOVE_TEXTLABEL = 'remove:Textlabel',
    //
    SET_ACTION_MENU = 'actions:Set',
    //
    TICKS_START = 'ticks:Start',
    //
    VEHICLES_VIEW_SPAWN = 'vehicles:Spawn',
    VEHICLES_VIEW_DESPAWN = 'vehicles:Despawn',
    //
    WORLD_UPDATE_TIME = 'time:Update',
    WORLD_UPDATE_WEATHER = 'weather:Update',
    //
    VOICE_ADD = 'voice:Add',
    VOICE_JOINED = 'voice:Joined'
}

export enum InventoryType {
    INVENTORY = 'inventory',
    EQUIPMENT = 'equipment',
    TOOLBAR = 'toolbar',
    GROUND = 'ground',
    TAB = 'tab'
}

export enum TeamType {
    NONE = 'none',
    SUPPORTER = 'supporter',
    MODERATOR = 'moderator',
    ADMINISTRATOR = 'Administrator',
    OWNER = 'owner'
}

export enum View_Events_Discord {
    Close = 'Discord:Close'
}

export enum View_Events_Creator {
    Done = 'creator:Done',
    Close = 'creator:Close',
    Show = 'creator:Show',
    Sync = 'creator:Sync',
    AwaitModel = 'creator:AwaitModel',
    AwaitName = 'creator:AwaitName'
}

export enum View_Events_Inventory {
    Process = 'inventory:Process',
    Use = 'inventory:Use',
    Split = 'inventory:Split',
    Pickup = 'inventory:Pickup'
}

export enum View_Events_Clothing {
    Open = 'clothing:Open',
    Sync = 'clothing:Sync',
    Purchase = 'clothing:Purchase',
    Exit = 'clothing:Exit'
}

export enum View_Events_Characters {
    Select = 'characters:Select',
    Create = 'characters:Create',
    Show = 'characters:Show',
    Done = 'characters:Done',
    Delete = 'characters:Delete'
}

export enum Vehicle_Lock_State {
    NO_LOCK = 0,
    UNLOCKED = 1,
    LOCKED = 2,
    LOCKOUT_PLAYER = 3,
    KIDNAP_MODE = 4
}

export const Vehicle_Lock_States: Array<Vehicle_Lock_State> = [Vehicle_Lock_State.UNLOCKED, Vehicle_Lock_State.LOCKED];

export enum Vehicle_Seat_List {
    DRIVER = -1,
    PASSENGER = 0,
    DRIVER_REAR = 1,
    PASSENGER_REAR = 2
}

export enum Vehicle_Door_List {
    DRIVER = 0,
    PASSENGER = 1,
    DRIVER_REAR = 2,
    PASSENGER_REAR = 3,
    HOOD = 4,
    TRUNK = 5
}

export enum Vehicle_Behavior {
    CONSUMES_FUEL = 1,
    UNLIMITED_FUEL = 2,
    NEED_KEY_TO_START = 4,
    NO_KEY_TO_START = 8,
    NO_KEY_TO_LOCK = 16,
    NO_SAVE = 32
}

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

export function inLockedState(state: Vehicle_Lock_State): boolean {
    if (state === null || state === undefined) return true;
    if (state === Vehicle_Lock_State.LOCKED || state === Vehicle_Lock_State.LOCKOUT_PLAYER) return true;
    return false;
}

interface PhoneEvent {
    name: string;
    isServer?: boolean;
}

export const PhoneEvents = { EVENT: { name: 'phone:Event' }, ATM_TRANSFER: { name: 'phone:ATM:Transfer', isServer: true }, ATM_PROCESS: { name: 'phone:ATM:Process' } };
export const PhoneEventList: Array<PhoneEvent> = [PhoneEvents.EVENT, PhoneEvents.ATM_TRANSFER, PhoneEvents.ATM_PROCESS];
