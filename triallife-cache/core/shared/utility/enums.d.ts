export declare enum EconomyTypes {
    BANK = "bank",
    CASH = "cash"
}
export declare enum EffectTypes {
    EFFECT_HEAL = "effect:Heal",
    EFFECT_FOOD = "effect:Food",
    EFFECT_WATER = "effect:Water",
    EFFECT_MOOD = "effect:Mood"
}
export declare enum EquipmentType {
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
export declare enum ItemType {
    NONE = 0,
    CAN_DROP = 1,
    CAN_STACK = 2,
    CAN_TRADE = 4,
    IS_EQUIPMENT = 8,
    IS_TOOLBAR = 16,
    IS_WEAPON = 32,
    DESTROY_ON_DROP = 64,
    CONSUMABLE = 128,
    SKIP_CONSUMABLE = 256
}
export declare enum SYSTEM_EVENTS {
    APPEND_BLIP = "append:Blip",
    APPEND_MARKER = "append:Marker",
    APPEND_TEXTLABELS = "append:TextLabel",
    BOOTUP_ENABLE_ENTRY = "enable:Entry",
    INTERIOR_SWITCH = "interior:Switch",
    INTERACTION = "player:Interact",
    INTERACTION_ATM = "atm:Open",
    INTERACTION_ATM_ACTION = "atm:Action",
    INTERACTION_FUEL = "fuel:Action",
    INTERACTION_JOB = "job:Interaction",
    INTERACTION_JOB_ACTION = "job:Action",
    META_SET = "meta:Set",
    META_CHANGED = "meta:Changed",
    NOCLIP_UPDATE = "noclip:Update",
    NOCLIP_RESET = "noclip:Reset",
    PLAYER_EMIT_ANIMATION = "animation:Play",
    PLAYER_EMIT_AUDIO_STREAM = "audio:Stream",
    PLAYER_EMIT_SOUND_2D = "sound:2D",
    PLAYER_EMIT_SOUND_3D = "sound:3D",
    PLAYER_EMIT_FRONTEND_SOUND = "sound:Frontend",
    PLAYER_EMIT_NOTIFICATION = "notification:Show",
    PLAYER_EMIT_TASK_MOVE = "task:Move",
    PLAYER_EMIT_TASK_TIMELINE = "task:Timeline",
    PLAYER_RELOAD = "player:ForceReload",
    PLAYER_SET_FREEZE = "freeze:Set",
    PLAYER_SET_DEATH = "death:Toggle",
    PLAYER_SET_INTERACTION = "interaction:Set",
    PLAYER_TICK = "player:Tick",
    PLAYER_TOOLBAR_SET = "player:Toolbar",
    PLAYER_ITEM_CHANGE = "player:ItemChange",
    PLAY_PARTICLE_EFFECT = "ptfx:Play",
    PROGRESSBAR_CREATE = "progressbar:Create",
    PROGRESSBAR_REMOVE = "progressbar:Remove",
    POPULATE_BLIPS = "blips:Populate",
    POPULATE_MARKERS = "markers:Populate",
    POPULATE_COMMANDS = "commands:Populate",
    POPULATE_ITEMS = "items:Populate",
    POPULATE_INTERACTIONS = "interactions:Populate",
    POPULATE_TEXTLABELS = "POPULATE_TEXTLABELS",
    QUICK_TOKEN_EMIT = "quicktoken:Emit",
    QUICK_TOKEN_FETCH = "quicktoken:Fetch",
    QUICK_TOKEN_NONE = "quicktoken:None",
    QUICK_TOKEN_UPDATE = "quicktoken:Update",
    REMOVE_MARKER = "remove:Marker",
    REMOVE_BLIP = "remove:Blip",
    REMOVE_TEXTLABEL = "remove:Textlabel",
    SET_ACTION_MENU = "actions:Set",
    TICKS_START = "ticks:Start",
    VEHICLES_VIEW_SPAWN = "vehicles:Spawn",
    VEHICLES_VIEW_DESPAWN = "vehicles:Despawn",
    WORLD_UPDATE_TIME = "time:Update",
    WORLD_UPDATE_WEATHER = "weather:Update",
    VOICE_ADD = "voice:Add",
    VOICE_JOINED = "voice:Joined"
}
export declare enum InventoryType {
    INVENTORY = "inventory",
    EQUIPMENT = "equipment",
    TOOLBAR = "toolbar",
    GROUND = "ground",
    TAB = "tab"
}
export declare enum TeamType {
    NONE = "none",
    SUPPORTER = "supporter",
    MODERATOR = "moderator",
    ADMINISTRATOR = "Administrator",
    OWNER = "owner"
}
export declare enum View_Events_Discord {
    Close = "Discord:Close"
}
export declare enum View_Events_Creator {
    Done = "creator:Done",
    Close = "creator:Close",
    Show = "creator:Show",
    Sync = "creator:Sync",
    AwaitModel = "creator:AwaitModel",
    AwaitName = "creator:AwaitName"
}
export declare enum View_Events_Inventory {
    Process = "inventory:Process",
    Use = "inventory:Use",
    Split = "inventory:Split",
    Pickup = "inventory:Pickup"
}
export declare enum View_Events_Clothing {
    Open = "clothing:Open",
    Sync = "clothing:Sync",
    Purchase = "clothing:Purchase",
    Exit = "clothing:Exit"
}
export declare enum View_Events_Characters {
    Select = "characters:Select",
    Create = "characters:Create",
    Show = "characters:Show",
    Done = "characters:Done",
    Delete = "characters:Delete"
}
export declare enum Vehicle_Lock_State {
    NO_LOCK = 0,
    UNLOCKED = 1,
    LOCKED = 2,
    LOCKOUT_PLAYER = 3,
    KIDNAP_MODE = 4
}
export declare const Vehicle_Lock_States: Array<Vehicle_Lock_State>;
export declare enum Vehicle_Seat_List {
    DRIVER = -1,
    PASSENGER = 0,
    DRIVER_REAR = 1,
    PASSENGER_REAR = 2
}
export declare enum Vehicle_Door_List {
    DRIVER = 0,
    PASSENGER = 1,
    DRIVER_REAR = 2,
    PASSENGER_REAR = 3,
    HOOD = 4,
    TRUNK = 5
}
export declare enum Vehicle_Behavior {
    CONSUMES_FUEL = 1,
    UNLIMITED_FUEL = 2,
    NEED_KEY_TO_START = 4,
    NO_KEY_TO_START = 8,
    NO_KEY_TO_LOCK = 16,
    NO_SAVE = 32
}
export declare const Vehicle_Events: {
    SET_INTO: string;
    SET_LOCK: string;
    SET_DOOR: string;
    SET_ENGINE: string;
    SET_SEATBELT: string;
};
export declare const Vehicle_State: {
    DOOR_DRIVER: string;
    DOOR_PASSENGER: string;
    DOOR_DRIVER_REAR: string;
    DOOR_PASSENGER_REAR: string;
    DOOR_HOOD: string;
    DOOR_TRUNK: string;
    LOCK_STATE: string;
    KEYS: string;
    OWNER: string;
    ENGINE: string;
    FUEL: string;
};
export declare function inLockedState(state: Vehicle_Lock_State): boolean;
interface PhoneEvent {
    name: string;
    isServer?: boolean;
}
export declare const PhoneEvents: {
    EVENT: {
        name: string;
    };
    ATM_TRANSFER: {
        name: string;
        isServer: boolean;
    };
    ATM_PROCESS: {
        name: string;
    };
};
export declare const PhoneEventList: Array<PhoneEvent>;
export {};
