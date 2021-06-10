/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/character';
import { Account, DiscordUser } from '../interface/entities';
import economy from './playerFunctions/economy';
import updater from './playerFunctions/updater';
import emit from './playerFunctions/emit';
import inventory from './playerFunctions/inventory';
import create from './playerFunctions/create';
import safe from './playerFunctions/safe';
import save from './playerFunctions/save';
import select from './playerFunctions/select';
import set from './playerFunctions/setter';
import sync from './playerFunctions/sync';
import utility from './playerFunctions/utility';

declare module 'alt-server' {
    export interface Player {
        pendingLogin?: boolean;
        discordToken?: string;
        needsQT?: boolean;
        hasModel?: boolean;
        isUnconscious?: boolean;
        characters: Array<Character>;
        pendingEditCharacter?: boolean;
        pendingCreateCharacter?: boolean;
        pendingSelectCharacter?: boolean;

        // Player Data
        account?: Partial<Account>; // Account Identifiers for Discord
        discord?: DiscordUser; // Discord Information
        data?: Partial<Character>; // Currently Selected Character

        // Anti
        acPosition?: alt.Vector3;
        acArmour?: number;

        // Status Effects
        nextDeathSpawn: number;
        nextPingTime: number;
        nextItemSync: number;
        nextFoodSync: number;
        nextPlayTime: number;

        // Toolbar Information
        lastToolbarData: { equipped: boolean; slot: number };

        // World Data
        gridSpace: number;
        currentWeather: string;

        // Vehicle Info
        lastEnteredVehicleID: number;
        lastVehicleID: number;
    }
}

export default function onLoad() {
    //
}

export const playerFuncs = {
    economy,
    updater,
    emit,
    inventory,
    create,
    safe,
    save,
    select,
    set,
    sync,
    utility
};
