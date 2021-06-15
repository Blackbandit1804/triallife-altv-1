import { Item } from './item';
import { Vector3 } from './vector';
import { Vehicle } from './vehicle';

export interface Furniture {
    pos: Vector3;
    rot: Vector3;
    hash: string;
}

export interface Interior {
    _id?: any;
    outside: Vector3;
    inside: Vector3;
    name: string;
    isActuallyOutside: boolean;
    forSale?: boolean;
    lockStatus?: boolean;
    price?: number;
    dimension?: number;
    friends?: Array<string>;
    factions?: Array<string>;
    mlos?: Array<string>;
    furniture?: Array<Furniture>;
    storage?: Array<Item>;
    vehicles?: Array<Vehicle>;
}
