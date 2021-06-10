import { CharacterDesign } from '../../shared/interfaces/design';
import { Item } from '../../shared/interfaces/item';
import { Vehicle } from '../../shared/interfaces/vehicle';

export interface Meta {
    permissionLevel: number;
    isDead: boolean;
    gridSpace: number;

    bank: number;
    cash: number;
    hunger: number;
    thirst: number;
    mood: number;
    voice: number;
    design: CharacterDesign;

    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;

    vehicles: Array<Vehicle>;
}
