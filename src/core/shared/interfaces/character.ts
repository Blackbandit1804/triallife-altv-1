import { Vector3 } from 'alt-server';
import { DefaultConfig } from '../../server/configs/settings';
import { Bank } from './bank';
import { Design } from './design';
import { Item } from './item';
import { Vehicle } from './vehicle';

export interface Character {
    _id?: any;
    accId: any;
    pos: Partial<Vector3>;
    bank: Partial<Bank>;
    info: Partial<CharacterInfo>;
    stats: Partial<CharacterStats>;
    isUnconsciouse: boolean;
    hours: number;
    interior: string | null;
    exterior: Partial<Vector3>;
    design: Partial<Design>;
    inventory: { maxWeight: number; money: number; items: Array<Partial<Item>> };
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
    vehicles: Array<Partial<Vehicle>>;
}

export const CharacterDefaults: Partial<Character> = {
    pos: DefaultConfig.PLAYER_CREATE_SPAWN_POS as Vector3,
    inventory: { maxWeight: 15.0, money: DefaultConfig.PLAYER_CASH, items: [] },
    bank: {},
    design: {},
    info: {},
    stats: { blood: 7500, hunger: 100, thirst: 100, mood: 100, armour: 0 },
    isUnconsciouse: false,
    hours: 0,
    vehicles: []
};

export interface CharacterInfo {
    gender: string;
    name: string;
    age: number;
}

export interface CharacterStats {
    blood: number;
    hunger: number;
    thirst: number;
    mood: number;
    armour: number;
}
