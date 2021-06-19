import { Design } from '../interfaces/design';
import { Item } from '../interfaces/item';
import { Vehicle } from '../interfaces/vehicle';

export interface Meta {
    permissionLevel: number;
    isDead: boolean;
    gridSpace: number;
    bank: number;
    cash: number;
    food: number;
    water: number;
    design: Design;
    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;

    vehicles: Array<Vehicle>;
}
