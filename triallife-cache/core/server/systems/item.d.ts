import { ItemType } from '../../shared/enums/itemType';
import { Item } from '../../shared/interfaces/Item';
export declare class ItemFactory {
    static create(name: string, description: string, icon: string, quantity: number, behavior: ItemType, data: {
        [key: string]: any;
    }, slot: number): Item | null;
    static clone(item: Item): Item;
}
