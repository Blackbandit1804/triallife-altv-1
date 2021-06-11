import { Vector3 } from 'alt-server';
import { DefaultConfig } from '../../server/configs/settings';
import { Design } from './design';
import { Item } from './Item';
import { Vehicle } from './vehicle';

export interface Character {
    _id?: any;
    account_id: any;
    pos: Partial<Vector3>;
    name: string;
    cash: number;
    bank: number;
    blood: number;
    hunger: number;
    thirst: number;
    mood: number;
    armour: number;
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

export const CharacterDefaults: Partial<Character> = {
    pos: DefaultConfig.PLAYER_NEW_SPAWN_POS as Vector3,
    cash: DefaultConfig.PLAYER_CASH,
    bank: DefaultConfig.PLAYER_BANK,
    design: {},
    info: {},
    hunger: 100,
    thirst: 100,
    mood: 100,
    isUnconscious: false,
    blood: 7500,
    armour: 0,
    hours: 0,
    vehicles: []
};

export interface CharacterInfo {
    gender: string;
    age: any;
}
