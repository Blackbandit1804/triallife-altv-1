/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/character';
import { Account, DiscordUser } from '../interface/entities';
declare module 'alt-server' {
    interface Player {
        pendingLogin?: boolean;
        discordToken?: string;
        needsQT?: boolean;
        hasModel?: boolean;
        isUnconscious?: boolean;
        characters: Array<Character>;
        pendingEditCharacter?: boolean;
        pendingCreateCharacter?: boolean;
        pendingSelectCharacter?: boolean;
        account?: Partial<Account>;
        discord?: DiscordUser;
        data?: Partial<Character>;
        acPosition?: alt.Vector3;
        acArmour?: number;
        nextDeathSpawn: number;
        nextPingTime: number;
        nextItemSync: number;
        nextFoodSync: number;
        nextPlayTime: number;
        lastToolbarData: {
            equipped: boolean;
            slot: number;
        };
        gridSpace: number;
        currentWeather: string;
        lastEnteredVehicleID: number;
        lastVehicleID: number;
    }
}
export default function onLoad(): void;
export declare const playerFuncs: {
    economy: {
        set: (player: alt.Player, type: any, amount: number) => boolean;
        sub: (player: alt.Player, type: any, amount: number) => boolean;
        add: (player: alt.Player, type: any, amount: number) => boolean;
        subAllCurrencies: (player: alt.Player, amount: number) => boolean;
    };
    updater: {
        init: (player: alt.Player, data?: Character) => void;
        updateByKeys: (player: alt.Player, dataObject: {
            [key: string]: any;
        }, targetDataName?: string) => void;
    };
    emit: {
        animation: (player: alt.Player, dictionary: string, name: string, flags: import("../../shared/flags/animation").AnimationFlags, duration?: number) => void;
        audioStream: (stream: import("../../shared/interfaces/audio").AudioStream) => void;
        createProgressBar: (player: alt.Player, progressbar: import("../../shared/interfaces/progress-bar").ProgressBar) => void;
        meta: (player: alt.Player, key: string, value: any) => void;
        notification: (player: alt.Player, message: string) => void;
        particle: (player: alt.Player, particle: import("../../shared/interfaces/particle").Particle, emitToNearbyPlayers?: boolean) => void;
        removeProgressBar: (player: alt.Player, uid: string) => void;
        sound2D: (player: alt.Player, audioName: string, volume?: number) => void;
        sound3D: (player: alt.Player, audioName: string, target: alt.Entity) => void;
        soundFrontend: (player: alt.Player, audioName: string, ref: string) => void;
        taskTimeline: (player: alt.Player, tasks: (import("../../shared/interfaces/task-timeline").Task | import("../../shared/interfaces/task-timeline").TaskCallback)[]) => void;
    };
    inventory: {
        allItemRulesValid: (player: alt.Player, item: import("../../shared/interfaces/item").Item, endSlot: import("../interface/category").CategoryData, endSlotIndex: number, customItemRules: Function[], tab: number) => boolean;
        equipmentAdd: (p: alt.Player, item: import("../../shared/interfaces/item").Item, slot: import("../../shared/utility/enums").EquipmentType) => boolean;
        equipmentRemove: (p: alt.Player, slot: import("../../shared/utility/enums").EquipmentType) => boolean;
        findAndRemove: (player: alt.Player, itemName: string) => boolean;
        getAllItems: (player: alt.Player) => import("../../shared/interfaces/item").ItemSpecial[];
        getAllWeapons: (player: alt.Player) => import("../../shared/interfaces/item").Item[];
        getEquipmentItem: (p: alt.Player, slot: number) => import("../../shared/interfaces/item").Item;
        getFreeInventorySlot: (p: alt.Player, tabNumber?: number) => {
            tab: number;
            slot: number;
        };
        getInventoryItem: (p: alt.Player, slot: number, tab: number) => import("../../shared/interfaces/item").Item;
        getSlotType: (slot: string) => string;
        getToolbarItem: (p: alt.Player, slot: number) => import("../../shared/interfaces/item").Item;
        handleSwapOrStack: (player: alt.Player, selectedSlot: string, endSlot: string, tab: number, customItemRules: Function[]) => void;
        hasItem: (player: alt.Player, item: Partial<import("../../shared/interfaces/item").Item>) => boolean;
        hasWeapon: (player: alt.Player) => import("../../shared/interfaces/item").Item;
        inventoryAdd: (p: alt.Player, item: import("../../shared/interfaces/item").Item, slot: number, tab: number) => boolean;
        inventoryRemove: (p: alt.Player, slot: number, tab: number) => boolean;
        isEquipmentSlotValid: (item: import("../../shared/interfaces/item").Item, slot: import("../../shared/utility/enums").EquipmentType) => boolean;
        isEquipmentSlotFree: (p: alt.Player, slot: import("../../shared/utility/enums").EquipmentType) => boolean;
        isInEquipment: (p: alt.Player, item: Partial<import("../../shared/interfaces/item").Item>) => {
            index: number;
        };
        isInInventory: (p: alt.Player, item: Partial<import("../../shared/interfaces/item").Item>) => {
            tab: number;
            index: number;
        };
        isInToolbar: (p: alt.Player, item: Partial<import("../../shared/interfaces/item").Item>) => {
            index: number;
        };
        isInventorySlotFree: (p: alt.Player, slot: number, tab: number) => boolean;
        isToolbarSlotFree: (p: alt.Player, slot: number) => boolean;
        removeAllWeapons: (player: alt.Player) => import("../../shared/interfaces/item").Item[];
        replaceInventoryItem: (p: alt.Player, item: import("../../shared/interfaces/item").Item, tab: number) => boolean;
        replaceToolbarItem: (p: alt.Player, item: import("../../shared/interfaces/item").Item) => boolean;
        stackInventoryItem: (player: alt.Player, item: import("../../shared/interfaces/item").Item) => boolean;
        toolbarAdd: (p: alt.Player, item: import("../../shared/interfaces/item").Item, slot: number) => boolean;
        toolbarRemove: (p: alt.Player, slot: number) => boolean;
    };
    create: {
        character: (p: alt.Player, appearance: Partial<import("../../shared/interfaces/design").CharacterDesign>, info: Partial<import("../../shared/interfaces/character").CharacterInfo>, name: string) => Promise<void>;
    };
    safe: {
        setPosition: (player: alt.Player, x: number, y: number, z: number) => void;
        addArmour: (p: alt.Player, value: number, exactValue?: boolean) => void;
        addBlood: (player: alt.Player, value: number) => void;
        addFood: (player: alt.Player, value: number) => void;
        addWater: (player: alt.Player, value: number) => void;
        addMood: (player: alt.Player, value: number) => void;
    };
    save: {
        field: (player: alt.Player, fieldName: string, fieldValue: any) => Promise<void>;
        partial: (player: alt.Player, dataObject: Partial<Character>) => Promise<void>;
        onTick: (p: alt.Player) => Promise<void>;
    };
    select: {
        character: (player: alt.Player, characterData: Partial<Character>) => Promise<void>;
    };
    set: {
        account: (player: alt.Player, account: Partial<Account>) => Promise<void>;
        actionMenu: (player: alt.Player, actionMenu: import("../../shared/interfaces/actions").ActionMenu) => void;
        unconscious: (player: alt.Player, killer?: alt.Player, weaponHash?: any) => void;
        firstConnect: (player: alt.Player) => Promise<void>;
        frozen: (player: alt.Player, value: boolean) => void;
        respawned: (player: alt.Player, position?: alt.Vector3) => void;
    };
    sync: {
        design: (player: alt.Player) => void;
        economy: (player: alt.Player) => void;
        inventory: (player: alt.Player) => void;
        playTime: (player: alt.Player) => void;
        syncedMeta: (player: alt.Player) => void;
        time: (player: alt.Player) => void;
        vehicles: (player: alt.Player) => void;
        food: (player: alt.Player) => void;
        water: (player: alt.Player) => void;
        mood: (player: alt.Player) => void;
        weather: (player: alt.Player) => void;
    };
    utility: {
        getClosestPlayers: (p: alt.Player, distance: number) => alt.Player[];
        getDistanceTo2D: (p: alt.Player, position: alt.Vector3) => number;
        getDistanceTo3D: (p: alt.Player, position: alt.Vector3) => number;
        getPlayerInFrontOf: (p: alt.Player, distance: number) => alt.Player;
        getPositionFrontOf: (p: alt.Player, distance: number) => alt.Vector3;
        getVehicleInFrontOf: (p: alt.Player, distance: number) => alt.Vehicle;
    };
};
