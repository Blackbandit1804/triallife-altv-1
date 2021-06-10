/// <reference types="@altv/types-server" />
import { Vector3 } from 'alt-server';
import { DEFAULT_CONFIG } from '../../server/configs/settings';
import { Design } from './design';
import { Item } from './item';
import { Vehicle } from './vehicle';

export interface Character {
    _id?: any;
    account_id: any;
    pos: Partial<Vector3>;
    name: string;
    cash: number;
    bank: number;
    blood: number;
    armour: number;
    hunger: number;
    thirst: number;
    mood: number;
    voice: number;
    isUnconscious: boolean;
    hours: number;
    interior: string | null;
    exterior: Partial<Vector3>;
    design: Partial<Design>;
    info: Partial<CharacterInfo>;
    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
    vehicles: Array<Partial<Vehicle>>;
}

export interface CharacterInfo {
    gender: string;
    age: any;
}

export const CharacterDefaults: Partial<Character> = {
    pos: DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS as Vector3,
    cash: DEFAULT_CONFIG.PLAYER_CASH,
    bank: DEFAULT_CONFIG.PLAYER_BANK,
    design: {},
    info: {},
    hunger: 0,
    thirst: 0,
    mood: 0,
    isUnconscious: false,
    blood: 7500,
    armour: 0,
    hours: 0,
    vehicles: []
};
