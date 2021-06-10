import { deepCloneObject } from '../../shared/utility/deepCopy';
export class ItemFactory {
    static create(name, description, icon, quantity, behavior, data, slot) {
        if (slot <= -1) {
            return null;
        }
        const item = {
            name,
            description,
            icon,
            quantity,
            behavior,
            data,
            slot
        };
        if (item.quantity <= -1) {
            item.quantity = 1;
        }
        return item;
    }
    static clone(item) {
        const newItem = deepCloneObject(item);
        return newItem;
    }
}
