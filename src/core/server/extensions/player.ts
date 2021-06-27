import * as alt from 'alt-server';
import { Character, CharacterStats } from '../../shared/interfaces/character';
import { Account } from '../interfaces/account';
import { DiscordUser } from '../interfaces/discord-user';
import create from './playerFuncs/create';
import economy from './playerFuncs/economy';
import emit from './playerFuncs/emit';
import inventory from './playerFuncs/inventory';
import save from './playerFuncs/save';
import select from './playerFuncs/selection';
import set from './playerFuncs/setter';
import sync from './playerFuncs/synchronize';
import updater from './playerFuncs/updater';
import utility from './playerFuncs/utility';

declare module 'alt-server' {
    export interface Player {
        discordToken?: string;

        needsQT?: boolean;
        hasModel?: boolean;

        characters: Array<Character>;

        pendingLogin?: boolean;
        pendingCharEdit?: boolean;
        pendingCharCreate?: boolean;
        pendingCharSelect?: boolean;

        account?: Partial<Account>;
        discord?: DiscordUser;
        data?: Partial<Character>;

        acPosition?: alt.Vector3;
        acStats?: Partial<CharacterStats>;

        nextUnconsciouseSpawn: number;
        nextPingTime: number;
        nextItemSync: number;
        nextStatSync: number;
        nextPlayTime: number;

        lastToolbarData: { equipped: boolean; slot: number };

        gridSpace: number;
        curWeather: string;

        lastEnteredVehicleID: number;
        lastVehicleID: number;
    }
}

export const playerFuncs = { economy, updater, emit, inventory, create, save, select, set, sync, utility };
