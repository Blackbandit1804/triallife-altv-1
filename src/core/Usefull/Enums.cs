using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Usefull {
	public class Enums {
		public enum Permission { None = 0, Supporter = 1, Moderator = 2, Administrator = 4, Owner = 8 }
		public enum EconomyType {            
            Bank, 
            Cash 
        }
		public enum AnimationFlag { NORMAL = 0, REPEAT = 1, STOP_LAST_FRAME = 2, UPPERBODY_ONLY = 16, ENABLE_PLAYER_CONTROL = 32, CANCELABLE = 120 }
		public enum SystemEvent {
            [Description("append:Blip")]
            APPEND_BLIP,
            [Description("append:Marker")]
            APPEND_MARKER,
            [Description("append:TextLabel")]
            APPEND_TEXTLABELS,
            [Description("enable:Entry")]
            BOOTUP_ENABLE_ENTRY,
            [Description("interior:Switch")]
            INTERIOR_SWITCH,
            [Description("player:Interact")]
            INTERACTION,
            [Description("atm:Open")]
            INTERACTION_ATM,
            [Description("atm:Action")]
            INTERACTION_ATM_ACTION,
            [Description("fuel:Action")]
            INTERACTION_FUEL,
            [Description("job:Interaction")]
            INTERACTION_JOB,
            [Description("job:Action")]
            INTERACTION_JOB_ACTION,
            [Description("meta:Set")]
            META_SET,
            [Description("meta:Changed")]
            META_CHANGED,
            [Description("noclip:Update")]
            NOCLIP_UPDATE,
            [Description("noclip:Reset")]
            NOCLIP_RESET,
            [Description("animation:Play")]
            PLAYER_EMIT_ANIMATION,
            [Description("audio:Stream")]
            PLAYER_EMIT_AUDIO_STREAM,
            [Description("sound:2D")]
            PLAYER_EMIT_SOUND_2D,
            [Description("sound:3D")]
            PLAYER_EMIT_SOUND_3D,
            [Description("sound:Frontend")]
            PLAYER_EMIT_FRONTEND_SOUND,
            [Description("notification:Show")]
            PLAYER_EMIT_NOTIFICATION,
            [Description("task:Move")]
            PLAYER_EMIT_TASK_MOVE,
            [Description("task:Timeline")]
            PLAYER_EMIT_TASK_TIMELINE,
            [Description("player:ForceReload")]
            PLAYER_RELOAD,
            [Description("freeze:Set")]
            PLAYER_SET_FREEZE,
            [Description("unconscious:Toggle")]
            PLAYER_SET_UNCONSCIOUS,
            [Description("interaction:Set")]
            PLAYER_SET_INTERACTION,
            [Description("player:Tick")]
            PLAYER_TICK,
            [Description("player:Toolbar")]
            PLAYER_TOOLBAR_SET,
            [Description("player:ItemChange")]
            PLAYER_ITEM_CHANGE,
            [Description("ptfx:Play")]
            PLAY_PARTICLE_EFFECT,
            [Description("progressbar:Create")]
            PROGRESSBAR_CREATE,
            [Description("progressbar:Remove")]
            PROGRESSBAR_REMOVE,
            [Description("blips:Populate")]
            POPULATE_BLIPS,
            [Description("markers:Populate")]
            POPULATE_MARKERS,
            [Description("commands:Populate")]
            POPULATE_COMMANDS,
            [Description("items:Populate")]
            POPULATE_ITEMS,
            [Description("interactions:Populate")]
            POPULATE_INTERACTIONS,
            [Description("textlabel:Populate")]
            POPULATE_TEXTLABELS,
            [Description("quicktoken:Emit")]
            QUICK_TOKEN_EMIT,
            [Description("quicktoken:Fetch")]
            QUICK_TOKEN_FETCH,
            [Description("quicktoken:None")]
            QUICK_TOKEN_NONE,
            [Description("quicktoken:Update")]
            QUICK_TOKEN_UPDATE,
            [Description("remove:Marker")]
            REMOVE_MARKER,
            [Description("remove:Blip")]
            REMOVE_BLIP,
            [Description("remove:Textlabel")]
            REMOVE_TEXTLABEL,
            [Description("actions:Set")]
            SET_ACTION_MENU,
            [Description("ticks:Start")]
            TICKS_START,
            [Description("vehicles:Spawn")]
            VEHICLES_VIEW_SPAWN,
            [Description("vehicles:Despawn")]
            VEHICLES_VIEW_DESPAWN,
            [Description("time:Update")]
            WORLD_UPDATE_TIME,
            [Description("weather:Update")]
            WORLD_UPDATE_WEATHER,
            [Description("voice:Switch")]
            VOICE_ADD,
            [Description("voice:Remove")]
            VOICE_REMOVE,
            [Description("voice:Joined")]
            VOICE_JOINED
        }
        public enum ViewEvent {
            [Description("discord:Close")]
            Discord_Close,
            [Description("creator:Done")]
            Creator_Done,
            [Description("creator:Close")]
            Creator_Close,
            [Description("creator:Show")]
            Creator_Show,
            [Description("creator:Sync")]
            Creator_Sync,
            [Description("creator:AwaitModel")]
            Creator_AwaitModel,
            [Description("creator:AwaitName")]
            Creator_AwaitName,
            [Description("inventory:Process")]
            Inventory_Process,
            [Description("inventory:Use")]
            Inventory_Use,
            [Description("inventory:Split")]
            Inventory_Split,
            [Description("inventory:Pickup")]
            Inventory_PickUp,
            [Description("clothing:Open")]
            Clothing_Open,
            [Description("clothing:Sync")]
            Clothing_Sync,
            [Description("clothing:Purchase")]
            Clothing_Purchase,
            [Description("clothing:Close")]
            Clothing_Close,
            [Description("characters:Select")]
            Characters_Select,
            [Description("characters:Show")]
            Characters_Show,
            [Description("characters:Done")]
            Characters_Done,
            [Description("characters:Delete")]
            Characters_Delete,
            [Description("hud:messages:Send")]
            Hud_SendMessage,
            [Description("hud:messages:Append")]
            Hud_AppendMessage,
        }
        public enum FuelType {
            None = 0, Electric = 1, Petrol = 2, Diesel = 4, Kerosene = 8 
        }
        public enum EquipmentType {
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
        public enum ItemType {
            None = 0,
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
        public enum InventoryType {
            [Description("inventory")]
            INVENTORY,
            [Description("equipment")]
            EQUIPMENT,
            [Description("toolbar")]
            TOOLBAR,
            [Description("ground")]
            GROUND,
            [Description("tab")]
            TAB
        }
        public enum TlrpEvent {
            [Description("tlrp:PlayerUnconscious")]
            UNCONSCIOUS,
            [Description("tlrp:PlayerDroppeditem")]
            DROPPED_ITEM,
            [Description("tlrp:SelectedCharacter")]
            SELECTED_CHARACTER,
            [Description("tlrp:PlayerSpawned")]
            PLAYER_SPAWNED,
            [Description("tlrp:VehicleSpawned")]
            VEHICLE_SPAWNED,
            [Description("tlrp:VehicleDespawned")]
            VEHICLE_DESPAWNED,
            [Description("tlrp:VehicleEngineState")]
            VEHICLE_ENGINE,
            [Description("tlrp:VehicleLockState")]
            VEHICLE_LOCK,
            [Description("tlrp:VehicleRepaired")]
            VEHICLE_REPAIRED,
        }

        #region Section : Vehicle
        public enum LockState {
            NO_LOCK = 0,
            UNLOCKED = 1,
            LOCKED = 2,
            LOCKOUT_PLAYER = 3,
            SECURITY_LOCK = 4
        }
        public enum VehicleBehavior {
            CONSUMES_FUEL = 1,
            UNLIMITED_FUEL = 2,
            NEED_KEY_TO_START = 4,
            NO_KEY_TO_START = 8,
            NO_KEY_TO_LOCK = 16,
            NO_SAVE = 32
        }
        public enum VehicleDoor {
            DRIVER = 0,
            PASSENGER = 1,
            DRIVER_REAR = 2,
            PASSENGER_REAR = 3,
            HOOD = 4,
            TRUNK = 5
        }
        public enum VehicleState {
            [Description("Door-0")]
            DOOR_DRIVER,
            [Description("Door-1")]
            DOOR_PASSENGER,
            [Description("Door-2")]
            DOOR_DRIVER_REAR,
            [Description("Door-3")]
            DOOR_PASSENGER_REAR,
            [Description("Door-4")]
            DOOR_HOOD,
            [Description("Door-5")]
            DOOR_TRUNK,
            [Description("Door-Locks")]
            LOCK_STATE,
            [Description("Vehicle-Keys")]
            KEYS,
            [Description("Vehicle-Owner")]
            OWNER,
            [Description("Vehicle-Engine")]
            ENGINE,
            [Description("Vehicle-Fuel")]
            FUEL,
        }
        public enum VehicleSeat {
            DRIVER = -1,
            PASSENGER = 0,
            DRIVER_REAR = 1,
            PASSENGER_REAR = 2
        }
        public enum VehicleEvent {
            [Description("Vehicle-Set-Into")]
            SET_INTO,
            [Description("Vehicle-Set-Lock")]
            SET_LOCK,
            [Description("Vehicle-Set-Door")]
            SET_DOOR,
            [Description("Vehicle-Set-Engine")]
            SET_ENGINE,
            [Description("Vehicle-Set-Seatbelt")]
            SET_SEATBELT
        }
        #endregion
    }
}
