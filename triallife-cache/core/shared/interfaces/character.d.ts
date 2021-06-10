/// <reference types="@altv/types-server" />
import { Vector3 } from 'alt-server';
import { CharacterDesign } from './design';
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
    design: Partial<CharacterDesign>;
    info: Partial<CharacterInfo>;
    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
    vehicles: Array<Partial<Vehicle>>;
}
export declare const CharacterDefaults: Partial<Character>;
export interface CharacterInfo {
    gender: string;
    age: any;
}
