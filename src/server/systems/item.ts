import { ItemTypes } from '../../shared/utility/enums';
import { Item } from '../../shared/interfaces/item';
import { deepCloneObject } from '../../shared/utility/usefull';

export class ItemFactory {
    static create(name: string, description: string, icon: string, quantity: number, behavior: ItemTypes, data: { [key: string]: any }, slot: number): Item | null {
        if (slot <= -1) return null;
        const item: Item = { name, description, icon, quantity, behavior, data, slot };
        if (item.quantity <= -1) item.quantity = 1;
        return item;
    }

    static clone(item: Item): Item {
        const newItem: Item = deepCloneObject(item);
        return newItem;
    }
}
