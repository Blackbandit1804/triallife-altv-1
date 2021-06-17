import { Bank } from '../../shared/interfaces/bank';
import { Design } from '../../shared/interfaces/design';
import { Item } from '../../shared/interfaces/item';
import { Vehicle } from '../../shared/interfaces/vehicle';

export interface Meta {
    permissionLevel: number;
    isUnconscious: boolean;
    gridSpace: number;
    bank: Partial<Bank>;
    money: number;

    blood: number;
    hunger: number;
    thirst: number;
    mood: number;
    design: Design;

    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
    vehicles: Array<Vehicle>;
}
