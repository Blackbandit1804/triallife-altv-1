import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import { Account, DiscordUser } from '../interface/account';
import currency from './playerFunctions/economy';
import dataUpdater from './playerFunctions/dataUpdater';
import emit from './playerFunctions/emit';
import inventory from './playerFunctions/inventory';
import createNew from './playerFunctions/new';
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
        characters: Array<Character>;
        pendingCharEdit?: boolean;
        pendingCharCreate?: boolean;
        pendingCharSelect?: boolean;

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
    currency,
    dataUpdater,
    emit,
    inventory,
    createNew,
    safe,
    save,
    select,
    set,
    sync,
    utility
};
