import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/character';
import { Account, DiscordUser } from '../interfaces/account';
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
        currentCharacters: Array<Character>;
        pendingCharacterEdit?: boolean;
        pendingNewCharacter?: boolean;
        pendingCharacterSelect?: boolean;

        accountData?: Partial<Account>;
        discord?: DiscordUser;
        data?: Partial<Character>;

        acPosition?: alt.Vector3;
        acArmour?: number;

        nextDeathSpawn: number;
        nextPingTime: number;
        nextItemSync: number;
        nextFoodSync: number;
        nextPlayTime: number;

        lastToolbarData: { equipped: boolean; slot: number };

        gridSpace: number;
        currentWeather: string;

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
