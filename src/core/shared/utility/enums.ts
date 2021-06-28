export enum EconomyType {
    MONEY = 'money',
    BANK = 'bank'
}

export enum EffectType {
    HEAL = 'effect:Heal',
    EAT = 'effect:Eat',
    DRINK = 'effect:Drink',
    SLEEP = 'effect:Sleep',
    REPAIR_VEHICLE = 'effect:Vehicle:Repair'
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

export enum ViewEvent {
    Discord_Fail = 'Discord:Fail',
    Discord_Close = 'Discord:Close',
    CharEditor_Done = 'chareditor:Done',
    CharEditor_Close = 'chareditor:Close',
    CharEditor_Show = 'chareditor:Show',
    CharEditor_Sync = 'chareditor:Sync',
    CharEditor_AwaitModel = 'chareditor:AwaitModel',
    CharEditor_AwaitName = 'chareditor:AwaitName',
    Inventory_Process = 'inventory:Process',
    Inventory_Use = 'inventory:Use',
    Inventory_Split = 'inventory:Split',
    Inventory_Pickup = 'inventory:Pickup',
    Clothing_Open = 'clothing:Open',
    Clothing_Sync = 'clothing:Sync',
    Clothing_Purchase = 'clothing:Purchase',
    Clothing_Exit = 'clothing:Exit',
    Character_Select = 'charselect:Select',
    Character_Create = 'charselect:Create',
    Character_Show = 'charselect:Show',
    Character_Done = 'charselect:Done',
    Character_Delete = 'charselect:Delete'
}

export enum SystemEvent {
    Animation_Play = 'animation:Play',
    Items_Populate = 'items:Populate',
    Player_Tick = 'player:Tick',
    Player_Reload = 'player:Reload',
    Player_Toolbar = 'player:Toolbar',
    Player_Ban = 'admin:Ban',
    Player_Unban = 'admin:Unban',
    Player_Interact = 'player:Interact',
    Interior_Switch = 'interior:Switch',
    Blip_Append = 'append:Blip',
    Blip_Populate = 'blips:Populate',
    Blip_Remove = 'remove:Blip',
    Interaction_Populate = 'interaction:Populate',
    Interaction_Set = 'interaction:Set',
    Atm_Open = 'atm:Open',
    Atm_Action = 'atm:Action',
    Fuel_Action = 'fuel:Action',
    Hud_Message_Append = 'hud:Messages:Append',
    Hud_Notification_Show = 'hud:Notification:Show',
    Hud_Particle_Play = 'hud:Particle:Play',
    Hud_Progress_Create = 'hud:Progress:Create',
    Hud_Progress_Remove = 'hud:Progress:Remove',
    Meta_Emit = 'meta:Emit',
    Meta_Changed = 'meta:Changed',
    Audio_Stream = 'audio:Stream',
    Sound_2D = 'sound:2D',
    Sound_3D = 'sound:3D',
    Sound_FrontEnd = 'sound:FrontEnd',
    Task_Timeline = 'task:Timeline',
    Player_Freeze = 'player:Freeze',
    QuickToken_None = 'quicktoken:None',
    QuickToken_Emit = 'quicktoken:Emit',
    QuickToken_Fetch = 'quicktoken:Fetch',
    QuickToken_Update = 'quicktoken:Update',
    Actions_Set = 'actions:Set',
    Ticks_Start = 'ticks:Start',
    Time_Update = 'time:Update',
    Weather_Update = 'weather:Update',
    Voice_Add = 'SaltyChat:EnablePlayer',
    Voice_Remove = 'SaltyChat:DisablePlayer'
}

export enum AnimationFlag {
    NORMAL = 0,
    REPEAT = 1,
    STOP_LAST_FRAME = 2,
    UPPERBODY_ONLY = 16,
    ENABLE_PLAYER_CONTROL = 32,
    CANCELABLE = 120
}

export enum Permission {
    None = 0,
    Supporter = 1,
    Moderator = 2,
    Admin = 4
}

export enum HudEventNames {
    SetVehicle = 'hud:SetVehicle',
    Seatbelt = 'hud:Seatbelt',
    Fuel = 'hud:SetFuel',
    Interact = 'hud:SetInteract',
    Food = 'hud:SetFood',
    Water = 'hud:SetWater',
    Mood = 'hud:SetMood',
    Blood = 'hud:SetBlood',
    Voice = 'hud:SetVoice',
    Speed = 'hud:Speed',
    Lock = 'hud:SetLock',
    Engine = 'hud:SetEngine',
    Lights = 'hud:SetLights',
    Objective = 'hud:SetObjective'
}

//#region vehicle
export enum VehicleLock_State {
    NO_LOCK = 0,
    UNLOCKED = 1,
    LOCKED = 2,
    LOCKOUT_PLAYER = 3,
    KIDNAP_MODE = 4
}

export const VehicleLock_States: Array<VehicleLock_State> = [VehicleLock_State.UNLOCKED, VehicleLock_State.LOCKED];

export enum VehicleSeatList {
    DRIVER = -1,
    PASSENGER = 0,
    DRIVER_REAR = 1,
    PASSENGER_REAR = 2
}

export enum VehicleDoorList {
    DRIVER = 0,
    PASSENGER = 1,
    DRIVER_REAR = 2,
    PASSENGER_REAR = 3,
    HOOD = 4,
    TRUNK = 5
}

export enum VehicleBehavior {
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

export const VehicleState = {
    DOOR_DRIVER: `Door-${VehicleDoorList.DRIVER}`,
    DOOR_PASSENGER: `Door-${VehicleDoorList.PASSENGER}`,
    DOOR_DRIVER_REAR: `Door-${VehicleDoorList.DRIVER_REAR}`,
    DOOR_PASSENGER_REAR: `Door-${VehicleDoorList.PASSENGER_REAR}`,
    DOOR_HOOD: `Door-${VehicleDoorList.HOOD}`,
    DOOR_TRUNK: `Door-${VehicleDoorList.TRUNK}`,
    LOCK_STATE: `Door-Locks`,
    KEYS: `Vehicle-Keys`,
    OWNER: 'Vehicle-Owner',
    ENGINE: 'Vehicle-Engine',
    FUEL: 'Vehicle-Fuel'
};

export function inLockedState(state: VehicleLock_State): boolean {
    if (state === null || state === undefined) return true;
    if (state === VehicleLock_State.LOCKED || state === VehicleLock_State.LOCKOUT_PLAYER) return true;
    return false;
}
//#endregion
