import { Design } from '../interfaces/design';
import { Item } from '../interfaces/item';
import { Vehicle } from '../interfaces/vehicle';

export interface Meta {
    permissionLevel: number;
    isUnconsciouse: boolean;
    gridSpace: number;
    bank: number;
    cash: number;
    food: number;
    water: number;
    design: Design;
    inventory: { maxWeight: number; money: number; items: Array<Partial<Item>> };
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
    vehicles: Array<Vehicle>;
}
