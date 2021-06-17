import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/character';
import { Account } from '../interfaces/account';
import { DiscordUser } from '../interfaces/discord-user';
import economy from './pFuncs/economy';
import updater from './pFuncs/data-updater';
import emit from './pFuncs/emit';
import inventory from './pFuncs/inventory';
import createNew from './pFuncs/create';
import safe from './pFuncs/safe';
import save from './pFuncs/save';
import select from './pFuncs/select';
import set from './pFuncs/setter';
import sync from './pFuncs/sync';
import utility from './pFuncs/utility';

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

        accountData?: Partial<Account>;
        discord?: DiscordUser;
        data?: Partial<Character>;

        acPosition?: alt.Vector3;
        acArmour?: number;

        nextUnconsciuosSpawn: number;
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

export const playerFuncs = {
    eco,
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
